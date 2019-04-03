if (typeof moment === 'undefined') {
    if(typeof require === 'function') {
        var moment = require('moment'); // Using nw.js or browserify?
    } else {
        throw new Error('Moment cannot be found by smdatetimerangepicker.');
    }
}

(function() {

/* global moment */
(function(){
    'use strict';

    function Calender(picker){
        return {
            restrict : 'E',
            replace:false,
            require: ['^ngModel', 'smCalender'],
            scope :{
                minDate: '=',
                maxDate: '=',
                initialDate : '=',
                format: '@',
                mode: '@',
                startView:'@',
                weekStartDay:'@',
                disableYearSelection:'@',
                dateSelectCall : '&'
            },
            controller:['$scope', '$timeout', 'picker', '$mdMedia', CalenderCtrl],
            controllerAs : 'vm',
            templateUrl:'picker/calender-date.html',
            link : function(scope, element, attr, ctrls){
                var ngModelCtrl = ctrls[0];
                var calCtrl = ctrls[1];
                calCtrl.configureNgModel(ngModelCtrl);

            }
        };
    }

    var CalenderCtrl = function($scope, $timeout, picker, $mdMedia){
        var self = this;

        self.$scope = $scope;
        self.$timeout = $timeout;
        self.picker = picker;
        self.dayHeader = self.picker.dayHeader;
        self.colorIntention = picker.colorIntention;        
        self.initialDate = $scope.initialDate;
        self.viewModeSmall = $mdMedia('xs');
        self.startDay = angular.isUndefined($scope.weekStartDay) || $scope.weekStartDay==='' ? 'Sunday' : $scope.weekStartDay ;
        self.minDate = $scope.minDate || undefined;			//Minimum date
        self.maxDate = $scope.maxDate || undefined;			//Maximum date
        self.mode = angular.isUndefined($scope.mode) ? 'DATE' : $scope.mode;
        self.format = angular.isUndefined($scope.format)? picker.format : $scope.format;
        self.restrictToMinDate = angular.isUndefined(self.minDate) ? false : true;
        self.restrictToMaxDate = angular.isUndefined(self.maxDate) ? false : true;
        self.stopScrollPrevious =false;
        self.stopScrollNext = false;
        self.disableYearSelection = $scope.disableYearSelection;
        self.monthCells=[];
        self.dateCellHeader= [];
        self.dateCells = [];
        self.monthList = moment.monthsShort();
        self.moveCalenderAnimation='';

        self.format = angular.isUndefined(self.format) ? 'MM-DD-YYYY': self.format;
        self.initialDate =	angular.isUndefined(self.initialDate) ? moment() : moment(self.initialDate, self.format);

        self.currentDate = self.initialDate.clone();
        self.minYear = 1900;
        self.maxYear = 3000;

        if(self.restrictToMinDate){
             if(!moment.isMoment(self.minDate)){
                self.minDate = moment(self.minDate, self.format);
            }
            /* the below code is giving some errors. It was added by Pablo Reyes, but I still need to check what
            he intended to fix.
            if(moment.isMoment(self.minDate)){
                self.minDate = self.minDate.subtract(1, 'd').startOf('day');
            }else{
                self.minDate = moment(self.minDate, self.format).subtract(1, 'd').startOf('day');
            }
            self.minYear = self.minDate.year();
            */
        }

        if(self.restrictToMaxDate) {
            if(!moment.isMoment(self.maxDate)){
                self.maxDate = moment(self.maxDate, self.format).startOf('day');
                self.maxYear = self.maxDate.year();
            }
        }



        self.yearItems = {
            currentIndex_: 1,
            PAGE_SIZE: 7,
            START: self.minYear,
            getItemAtIndex: function(index) {
                if(!this.START+ index<=(self.maxYear)) {
                    return (this.START+ index); 
                }else{
                    return this.START ;
                }

                if(this.currentIndex_ < index){
                    this.currentIndex_ = index;
                    return this.START + index;                    
                } 
                if(this.currentIndex_ < index){
                    this.currentIndex_ = index;
                }
                return this.START + index;
            },
            getLength: function() {
                return this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2);
            }
        };

        self.init();
    };

    CalenderCtrl.prototype.setInitDate = function(dt) {
        var self = this;
        self.initialDate =angular.isUndefined( dt) ? moment() : moment( dt, self.format);
    };


    CalenderCtrl.prototype.configureNgModel = function(ngModelCtrl) {
        var self = this;
        self.ngModelCtrl = ngModelCtrl;

        self.ngModelCtrl.$formatters.push(function(dateValue) {

            if(self.format){
                if(dateValue){
                    if(moment.isMoment(dateValue)){
                        self.initialDate = dateValue;
                    }else{
                        self.initialDate = moment(dateValue, self.format);

                    }
                }
                self.currentDate = self.initialDate.clone();
                self.buildDateCells();
            }
        });
    };


    CalenderCtrl.prototype.setNgModelValue = function(date) {
        var self = this;
        self.ngModelCtrl.$setViewValue(date);
        self.ngModelCtrl.$render();
    };

    CalenderCtrl.prototype.init = function(){
        var self = this;
        self.buildDateCells();
        self.buildDateCellHeader();
        self.buildMonthCells();
        self.setView();
        self.showYear();


    };

    CalenderCtrl.prototype.setView = function(){
        var self = this;
        self.headerDispalyFormat = 'ddd, MMM DD';
        switch(self.mode) {
            case 'date-time':
            self.view = 'DATE';
            self.headerDispalyFormat = 'ddd, MMM DD HH:mm';
            break;
            case 'time':
            self.view = 'HOUR';
            self.headerDispalyFormat = 'HH:mm';
            break;
            default:
            self.view = 'DATE';
        }
    };


    CalenderCtrl.prototype.showYear = function() {
        var self = this;
        self.yearTopIndex = (self.initialDate.year() - self.yearItems.START) + Math.floor(self.yearItems.PAGE_SIZE / 2);
        self.yearItems.currentIndex_ = (self.initialDate.year() - self.yearItems.START)-1;
    };


    CalenderCtrl.prototype.buildMonthCells = function(){
        var self = this;
        self.monthCells = moment.months();
    };

    CalenderCtrl.prototype.buildDateCells = function(){
        var self = this;
        var currentMonth = self.initialDate.month();
        var calStartDate = self.initialDate.clone().date(0).day(self.startDay).startOf('day');
        var lastDayOfMonth = self.initialDate.clone().endOf('month');
        var weekend = false;
        var isDisabledDate =false;
        /*
        Check if min date is greater than first date of month
        if true than set stopScrollPrevious=true
        */
        if(!angular.isUndefined(self.minDate)){
            self.stopScrollPrevious	 = self.minDate.unix() >= calStartDate.unix();
        }
        self.dateCells =[];
        for (var i = 0; i < 6; i++) {
            var week = [];
            for (var j = 0; j < 7; j++) {

                var isCurrentMonth = (calStartDate.month()=== currentMonth);

                isDisabledDate = isCurrentMonth? false:true;
                //if(isCurrentMonth){isDisabledDate=false}else{isDisabledDate=true};

                if(self.restrictToMinDate && !angular.isUndefined(self.minDate) && !isDisabledDate)
                isDisabledDate = self.minDate.isAfter(calStartDate);

                if(self.restrictToMaxDate && !angular.isUndefined(self.maxDate) && !isDisabledDate)
                isDisabledDate = self.maxDate.isBefore(calStartDate);

                var day = {
                    date : calStartDate.clone(),
                    dayNum: isCurrentMonth ? calStartDate.date() :'',
                    month : calStartDate.month(),
                    today: calStartDate.isSame(moment(), 'day') && calStartDate.isSame(moment(), 'month'),
                    year : calStartDate.year(),
                    dayName : calStartDate.format('dddd'),
                    isWeekEnd : weekend,
                    isDisabledDate : isDisabledDate,
                    isCurrentMonth : isCurrentMonth
                };
                week.push(day);
                calStartDate.add(1, 'd');
            }
            self.dateCells.push(week);
        }
        /*
        Check if max date is greater than first date of month
        if true than set stopScrollPrevious=true
        */

        if(self.restrictToMaxDate && !angular.isUndefined(self.maxDate)){
            self.stopScrollNext	=  self.maxDate.isBefore(lastDayOfMonth);
        }

        if(self.dateCells[0][6].isDisabledDate && !self.dateCells[0][6].isCurrentMonth){
            self.dateCells[0].splice(0);
        }
    };

    CalenderCtrl.prototype.changePeriod = function(c){
        var self = this;
        if(c === 'p'){
            if(self.stopScrollPrevious) return;
            self.moveCalenderAnimation='slideLeft';
            self.initialDate.subtract(1, 'M');
        }else{
            if(self.stopScrollNext) return;
            self.moveCalenderAnimation='slideRight';
            self.initialDate.add(1, 'M');
        }

        self.buildDateCells();
        self.$timeout(function(){
            self.moveCalenderAnimation='';
        }, 500);
    };


    CalenderCtrl.prototype.selectDate = function(d, isDisabled){
        var self = this;
        if (isDisabled) {
            return;
        }

        /* Related to issue #173. After chrome v73, the calendar started to fail. I did not find
        any explanation yet but this delay fix the issue. */
        self.$timeout(function(){
            self.currentDate = d;
            self.$scope.dateSelectCall({date:d});
            /*
            * No need to save the model yet. It must be stored until "save" is clicked.
            * @see bug #147.
            * self.setNgModelValue(d);
            */
            self.$scope.$emit('calender:date-selected');
        }, 0);


    };


    CalenderCtrl.prototype.buildDateCellHeader = function(startFrom) {
        var self = this;
        var daysByName = self.picker.daysNames;
        var keys = [];
        var key;
        for (key in daysByName) {
            keys.push(key);
        }
        
        var startIndex = moment().day(self.startDay).day(), count = 0;
        
        for (key in daysByName) {
            self.dateCellHeader.push(daysByName[ keys[ (count + startIndex) % (keys.length)] ]);
            count++; // Don't forget to increase count.
        }
    };
    /*
    Month Picker
    */

    CalenderCtrl.prototype.changeView = function(view){
        var self = this;
        if(self.disableYearSelection){
            return;
        }else{
            if(view==='YEAR_MONTH'){
                self.showYear();
            }
            self.view =view;
        }
    };

    /*
    Year Picker
    */


    CalenderCtrl.prototype.changeYear = function(yr, mn){
        var self = this;
        self.initialDate.year(yr).month(mn);
        self.buildDateCells();
        self.view='DATE';
    };

    /*
    Hour and Time
    */


    CalenderCtrl.prototype.setHour = function(h){
        var self = this;
        self.currentDate.hour(h);
    };

    CalenderCtrl.prototype.setMinute = function(m){
        var self = this;
        self.currentDate.minute(m);
    };

    CalenderCtrl.prototype.selectedDateTime = function(){
        var self = this;
        self.setNgModelValue(self.currentDate);
        if(self.mode === 'time')
        self.view='HOUR';
        else
        self.view='DATE';
        self.$scope.$emit('calender:close');
    };

    CalenderCtrl.prototype.closeDateTime = function(){
        var self = this;
        if(self.mode === 'time')
        self.view='HOUR';
        else
        self.view='DATE';

        self.$scope.$emit('calender:close');
    };

    Calender.$inject = ['picker'];

    CalenderCtrl.prototype.isPreviousDate = function(yearToCheck, monthToCheck)
    {
        var self = this;
        if(angular.isUndefined(self.minDate) || angular.isUndefined(yearToCheck) || angular.isUndefined(monthToCheck))
        {
            return false;
        }
        var _current_year = self.minDate.year();
        if(yearToCheck < _current_year)
        {
            return true;
        }else if(yearToCheck === _current_year)
        {
            if(monthToCheck < self.minDate.month())
            {
                return true;
            }
        }
        return false;
    };

    var app = angular.module('smDateTimeRangePicker', []);
    app.directive('smCalender', Calender);
})();

/* global moment */
(function(){
	'use strict';

	function TimePicker(){
		return {
			restrict : 'E',
			replace:true,
			require: ['^ngModel', 'smTime'],
			scope :{
				initialTime : '@',
				format:'@',
				timeSelectCall : '&'
			},
			controller:['$scope', 'picker', TimePickerCtrl],
			controllerAs : 'vm',
			templateUrl:'picker/calender-hour.html',
			link : function(scope, element, att, ctrls){
				var ngModelCtrl = ctrls[0];
				var calCtrl = ctrls[1];
				calCtrl.configureNgModel(ngModelCtrl);

			}
		}
	}

	var TimePickerCtrl = function($scope, picker){
		var self = this;
		self.uid = Math.random().toString(36).substr(2, 5);
		self.$scope = $scope;
		self.picker = picker;
		self.initialDate = $scope.initialTime; 	//if calender to be  initiated with specific date
		self.colorIntention = picker.colorIntention;		
		self.format = $scope.format;
		self.hourItems =[];
		self.minuteCells =[];
		self.format = angular.isUndefined(self.format) ? 'HH:mm': self.format;
		self.initialDate =	angular.isUndefined(self.initialDate)? moment() : moment(self.initialDate, self.format);
		self.currentDate = self.initialDate.clone();
		self.hourSet =false;
		self.minuteSet = false;

		self.show=true;
		self.init();
	}

	TimePickerCtrl.prototype.init = function(){
		var self = this;
		self.buidHourCells();
		self.buidMinuteCells();
		self.headerDispalyFormat = 'HH:mm';
		self.showHour();
	};

	TimePickerCtrl.prototype.showHour = function() {
		var self = this;

		self.hourTopIndex = 22;
		self.minuteTopIndex	= (self.initialDate.minute() -0) + Math.floor(7 / 2);
		//self.yearTopIndex = (self.initialDate.year() - self.yearItems.START) + Math.floor(self.yearItems.PAGE_SIZE / 2);
		//	self.hourItems.currentIndex_ = (self.initialDate.hour() - self.hourItems.START) + 1;
	};

	TimePickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
		this.ngModelCtrl = ngModelCtrl;
		var self = this;
		ngModelCtrl.$render = function() {
			self.ngModelCtrl.$viewValue= self.currentDate;
		};
	};


	TimePickerCtrl.prototype.setNgModelValue = function(date) {
		var self = this;
		self.ngModelCtrl.$setViewValue(date);
		self.ngModelCtrl.$render();
	};




	TimePickerCtrl.prototype.buidHourCells = function(){
		var self = this;

		for (var i = 0 ; i <= 23; i++) {
			var hour={
				hour : i,
				isCurrent :(self.initialDate.hour())=== i
			}
			self.hourItems.push(hour);
		};
	};

	TimePickerCtrl.prototype.buidMinuteCells = function(){
		var self = this;
		self.minuteTopIndex	= self.initialDate.minute();
		for (var i = 0 ; i <= 59; i++) {
			var minute = {
				minute : i,
				isCurrent : (self.initialDate.minute())=== i,
			}
			self.minuteCells.push(minute);
		};
	};


	TimePickerCtrl.prototype.selectDate = function(d, isDisabled){
		var self = this;
		if (isDisabled) return;
		self.currentDate = d;

		self.$scope.$emit('calender:date-selected');

	}


	TimePickerCtrl.prototype.setHour = function(h){
		var self = this;
		self.currentDate.hour(h);
		self.setNgModelValue(self.currentDate);
		self.hourSet =true;
		if(self.hourSet && self.minuteSet){
			self.$scope.timeSelectCall({time: self.currentDate});
			self.hourSet=false;
			self.minuteSet=false;
		}
	}

	TimePickerCtrl.prototype.setMinute = function(m){
		var self = this;
		self.currentDate.minute(m);
		self.setNgModelValue(self.currentDate);
		self.minuteSet =true;
		if(self.hourSet && self.minuteSet){
			self.$scope.timeSelectCall({time: self.currentDate});
			self.hourSet=false;
			self.minuteSet=false;
		}

	}

	TimePickerCtrl.prototype.selectedDateTime = function(){
		var self = this;
		self.setNgModelValue(self.currentDate);
		if(self.mode === 'time')
		self.view='HOUR'
		else
		self.view='DATE';
		self.$scope.$emit('calender:close');
	}

	var app = angular.module('smDateTimeRangePicker');
	app.directive('smTime', ['$timeout', TimePicker]);
})();

/* global moment */
(function(){
	'use strict';

	function DatePickerDir($timeout, picker, $mdMedia, $window) {
		return {
			restrict : 'E',
			require: ['^ngModel', 'smDatePicker'],
			replace: false,
			scope :{
				initialDate : '=',
				minDate	:'=',
				maxDate:'=',
				format:'@',
				mode:'@',
				startDay:'@',
				closeOnSelect:'@',
				weekStartDay:'@',
				disableYearSelection: '@',
				onSelectCall : '&'
			},
			controller: ['$scope', 'picker', '$mdMedia', PickerCtrl],
			controllerAs: 'vm',
			bindToController:true,
			templateUrl:'picker/date-picker.html',
			link : function(scope, element, att, ctrls){
				var ngModelCtrl = ctrls[0];
				var calCtrl = ctrls[1];
				calCtrl.configureNgModel(ngModelCtrl);
			}
		};
	}

	var PickerCtrl = function($scope, picker, $mdMedia){
		var self = this;
		self.scope = $scope;
		self.okLabel = picker.okLabel;
		self.cancelLabel = picker.cancelLabel;
		self.picker = picker;
		self.colorIntention = picker.colorIntention;
		self.$mdMedia =$mdMedia;
		self.init();

	};

	PickerCtrl.prototype.init = function() {
		var self = this;

		if(angular.isUndefined(self.mode) || self.mode ===''){
			self.mode = 'date';
		}
		self.currentDate = isNaN(self.ngModelCtrl) ? moment(): self.ngModelCtrl.$viewValue ;
		self.setViewMode(self.mode);
	};


	PickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
		var self = this;
		self.ngModelCtrl = ngModelCtrl;
		self.ngModelCtrl.$render = function() {
			self.ngModelCtrl.$viewValue= ngModelCtrl.$viewValue;
			self.ngModelCtrl.$modelvalue= ngModelCtrl.$modelvalue;
			self.initialDate = self.ngModelCtrl.$viewValue;
		};
	};


	PickerCtrl.prototype.setViewMode = function(mode){
		var self = this;
		switch(mode) {
			case 'date':
			self.view = 'DATE';
			self.headerDispalyFormat = self.picker.customHeader.date;
			break;
			case 'date-time':
			self.view = 'DATE';
			self.headerDispalyFormat = self.picker.customHeader.dateTime;
			break;
			case 'time':
			self.view = 'TIME';
			self.headerDispalyFormat = 'HH:mm';
			break;
			default:
			self.headerDispalyFormat = 'ddd, MMM DD ';
			self.view = 'DATE';
		}
	};

	PickerCtrl.prototype.setNextView = function(){
		var self = this;
		switch (self.mode){
			case 'date':
			self.view = 'DATE';
			break;
			case 'date-time':
			self.view = self.view==='DATE' ? 'TIME':'DATE';
			break;
			default:
			self.view = 'DATE';
		}
	};

	PickerCtrl.prototype.selectedDateTime = function(){
		var self = this;
		var date = moment(self.selectedDate, self.format);
		if(!date.isValid()){
			date = moment();
			self.selectedDate =date;
		}
		if(!angular.isUndefined(self.selectedTime)){
			date.hour(self.selectedTime.hour()).minute(self.selectedTime.minute());
		}
		self.setNgModelValue(date);

	};

	PickerCtrl.prototype.dateSelected = function(date){
		var self = this;

		self.currentDate.date(date.date()).month(date.month()).year(date.year());
		self.selectedDate = self.currentDate;
		if(self.closeOnSelect && self.mode==='date'){
			self.selectedDateTime();
		}else{
			self.setNextView();
		}
	};

	PickerCtrl.prototype.timeSelected = function(time){
		var self = this;
		self.currentDate.hours(time.hour()).minutes(time.minute());
		self.selectedTime= self.currentDate;

		if(self.closeOnSelect && self.mode==='date-time')
			self.selectedDateTime();
		else
			self.setNextView();
	};

	PickerCtrl.prototype.setNgModelValue = function(date) {
		var self = this;
		self.onSelectCall({date: date});
		self.ngModelCtrl.$setViewValue(date.format(self.format));
		self.ngModelCtrl.$render();
		self.closeDateTime();

	};


	PickerCtrl.prototype.closeDateTime = function(){
		var self = this;
		self.view = 'DATE';
		self.scope.$emit('calender:close');
	};

	function TimePickerDir($timeout, picker, $mdMedia, $window) {
		return {
			restrict : 'E',
			require: '^ngModel',
			replace:true,
			scope :{
				initialDate : '@',
				format:'@',
				mode:'@',
				closeOnSelect:'@'
			},
			templateUrl:'picker/time-picker.html',
			link : function(scope, element, att, ngModelCtrl){
				setViewMode(scope.mode);

				scope.okLabel = picker.okLabel;
				scope.cancelLabel = picker.cancelLabel;

				scope.currentDate = isNaN(ngModelCtrl.$viewValue) ? moment(): ngModelCtrl.$viewValue ;

				scope.$mdMedia =$mdMedia;
				function setViewMode(mode){
					switch(mode) {
						case 'date-time':
						scope.view = 'DATE';
						scope.headerDispalyFormat = 'ddd, MMM DD HH:mm';
						break;
						case 'time':
						scope.view = 'HOUR';
						scope.headerDispalyFormat = 'HH:mm';
						break;
						default:
						scope.view = 'DATE';
					}
				}

				scope.$on('calender:date-selected', function(){
					if(scope.closeOnSelect && (scope.mode!=='date-time' || scope.mode!=='time')){
						var date = moment(scope.selectedDate, scope.format);
						if(!date.isValid()){
							date = moment();
							scope.selectedDate =date;
						}
						if(!angular.isUndefined(scope.selectedTime)){
							date.hour(scope.selectedTime.hour()).minute(scope.selectedTime.minute());
						}
						scope.currentDate =scope.selectedDate;
						ngModelCtrl.$setViewValue(date.format(scope.format));
						ngModelCtrl.$render();
						setViewMode(scope.mode);
						scope.$emit('calender:close');

					}
				});

				scope.selectedDateTime = function(){
					var date = moment(scope.selectedDate, scope.format);
					if(!date.isValid()){
						date = moment();
						scope.selectedDate =date;
					}
					if(!angular.isUndefined(scope.selectedTime)){
						date.hour(scope.selectedTime.hour()).minute(scope.selectedTime.minute());
					}
					scope.currentDate =scope.selectedDate;
					ngModelCtrl.$setViewValue(date.format(scope.format));
					ngModelCtrl.$render();
					setViewMode(scope.mode);
					scope.$emit('calender:close');
				};


				scope.closeDateTime = function(){
					scope.$emit('calender:close');
				};

			}
		};
	}

	var app = angular.module('smDateTimeRangePicker');
	app.directive('smDatePicker', ['$timeout', 'picker', '$mdMedia', '$window', DatePickerDir]);
	app.directive('smTimePicker', ['$timeout', 'picker', '$mdMedia', '$window', TimePickerDir]);
})();

/* global moment */
(function(){
    'use strict';

    var app = angular.module('smDateTimeRangePicker');


    function DatePickerServiceCtrl($scope, $mdDialog, $mdMedia, $timeout, $mdUtil, picker){
        var self = this;

        if(!angular.isUndefined(self.options) && (angular.isObject(self.options))){
            self.mode = isExist(self.options.mode, self.mode);
            self.format = isExist(self.options.format, 'MM-DD-YYYY');
            self.minDate = isExist(self.options.minDate, undefined);
            self.maxDate = isExist(self.options.maxDate, undefined);
            self.weekStartDay = isExist(self.options.weekStartDay, 'Sunday');
            self.closeOnSelect =isExist(self.options.closeOnSelect, false);
        }

        if(!angular.isObject(self.initialDate)){
            self.initialDate = moment(self.initialDate, self.format);
            self.selectedDate = self.initialDate;
        }

        self.currentDate = self.initialDate;
        self.viewDate = self.currentDate;

        self.view = 'DATE';
        self.$mdMedia = $mdMedia;
        self.$mdUtil = $mdUtil;

        self.okLabel = picker.okLabel;
        self.cancelLabel = picker.cancelLabel;



        setViewMode(self.mode);

        function isExist(val, def){
            return angular.isUndefined(val)? def:val;
        }

        function setViewMode(mode){
            switch(mode) {
                case 'date':
                self.headerDispalyFormat = 'ddd, MMM DD ';
                break;
                case 'date-time':
                self.headerDispalyFormat = 'ddd, MMM DD HH:mm';
                break;
                case 'time':
                self.headerDispalyFormat = 'HH:mm';
                break;
                default:
                self.headerDispalyFormat = 'ddd, MMM DD ';
            }
        }

        self.autoClosePicker = function(){
            if(self.closeOnSelect){
                if(angular.isUndefined(self.selectedDate)){
                    self.selectedDate = self.initialDate;
                }
                //removeMask();
                $mdDialog.hide(self.selectedDate.format(self.format));
            }
        }

        self.dateSelected = function(date){
            self.selectedDate = date;
            self.viewDate = date;
            if(self.mode==='date-time')
            self.view = 'HOUR';
            else
            self.autoClosePicker();
        }

        self.timeSelected = function(time){
            self.selectedDate.hour(time.hour()).minute(time.minute());
            self.viewDate = self.selectedDate;
            self.autoClosePicker();
        }

        self.closeDateTime = function(){
            $mdDialog.cancel();
            removeMask();
        }
        self.selectedDateTime = function(){
            if(angular.isUndefined(self.selectedDate)){
                self.selectedDate= self.currentDate;
            }
            $mdDialog.hide(self.selectedDate.format(self.format));
            removeMask();
        }

        function removeMask(){
            var ele = document.getElementsByClassName('md-scroll-mask');
            if(ele.length!==0){
                angular.element(ele).remove();
            }
        }

    }

    app.provider('smDateTimePicker', function() {

        this.$get = ['$mdDialog', function($mdDialog) {

            var datePicker = function(initialDate, options) {
                if (angular.isUndefined(initialDate)) initialDate = moment();

                if (!angular.isObject(options)) options = {};

                return $mdDialog.show({
                    controller:  ['$scope', '$mdDialog', '$mdMedia', '$timeout', '$mdUtil', 'picker', DatePickerServiceCtrl],
                    controllerAs: 'vm',
                    bindToController: true,
                    clickOutsideToClose: true,
                    targetEvent: options.targetEvent,
                    templateUrl: 'picker/date-picker-service.html',
                    locals: {
                        initialDate: initialDate,
                        options: options
                    },
                    skipHide: true
                });
            };

            return datePicker;
        }];
    });
})();

/* global moment */
function DateTimePicker($mdUtil, $mdMedia, $document, picker) {
    return {
        restrict: 'E',
        require: ['^ngModel', 'smDateTimePicker'],
        scope: {
            weekStartDay: '@',
            startView: '@',
            mode: '@',
            format: '@',
            minDate: '@',
            maxDate: '@',
            fname: '@',
            label: '@',
            isRequired: '@',
            disable: '=',
            noFloatingLabel: '=',
            disableYearSelection: '@',
            closeOnSelect: '@',
            onDateSelectedCall: '&'
        },
        controller: ['$scope', '$element', '$mdUtil', '$mdMedia', '$document','$parse', SMDateTimePickerCtrl],
        controllerAs: 'vm',
        bindToController:true,
        template: function (element, attributes){
            var inputType = '';
            if(attributes.hasOwnProperty('onFocus')) {
                inputType = '<input name="{{vm.fname}}" ng-model="vm.value" '
                            + 'type="text" placeholder="{{vm.label}}"'
                            + ' aria-label="{{vm.fname}}" ng-focus="vm.show()" data-ng-required="vm.isRequired"  ng-disabled="vm.disable"'
                            + ' server-error class="sm-input-container" />' ;
            } else {
                inputType = 
                    '<input class="" name="{{vm.fname}}" ng-model="vm.value" '
                    + '             type="text" placeholder="{{vm.label}}" '
                    + '             aria-label="{{vm.fname}}" aria-hidden="true" data-ng-required="vm.isRequired" ng-disabled="vm.disable"/>'
                    + '     <md-button tabindex="-1" class="sm-picker-icon md-icon-button" aria-label="showCalender" ng-disabled="vm.disable" aria-hidden="true" type="button" ng-click="vm.show()">'
                    + '         <svg  fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
                    + '     </md-button>' ;
            }

            return '<md-input-container class="sm-input-container md-icon-float md-block" md-no-float="vm.noFloatingLabel">' +
                    inputType +
                    '     <div id="picker" class="sm-calender-pane md-whiteframe-z2">' +
                    '          <sm-date-picker ' +
                    '              id="{{vm.fname}}Picker" ' +
                    '              initial-date="vm.initialDate"' +
                    '              ng-model="vm.value"' +
                    '              mode="{{vm.mode || \'date\'}}" ' +
                    '              disable-year-selection={{vm.disableYearSelection}}' +
                    '              close-on-select="{{vm.closeOnSelect}}"' +
                    '              start-view="{{vm.startView}}" ' +
                    '              data-min-date="vm.minDate" ' +
                    '              data-max-date="vm.maxDate"  ' +
                    '              data-format="{{vm.format}}"  ' +
                    '              data-on-select-call="vm.onDateSelected(date)"' +
                    '              data-week-start-day="{{vm.weekStartDay}}" > ' +
                    '         </sm-date-picker>' +
                    '     </div>' +
                    '     <div></div>'
                    ' </md-input-container>';
        },
        link: function(scope, $element, attr, ctrl) {
            var ngModelCtrl = ctrl[0];
            var pickerCtrl = ctrl[1];
            pickerCtrl.configureNgModel(ngModelCtrl);
        }
    }
}
var SMDateTimePickerCtrl = function($scope, $element, $mdUtil, $mdMedia, $document,$parse) {
    var self = this;
    self.$scope = $scope;
    self.$element = $element;
    self.$mdUtil = $mdUtil;
    self.$mdMedia = $mdMedia;
    self.$document = $document;
    self.isCalenderOpen = false;
    self.disablePicker = $scope.disable;

    self.calenderHeight = 320;
    self.calenderWidth = 450;


    //find input button and assign to variable
    self.inputPane = $element[0].querySelector('.sm-input-container');

    //find Calender Picker  and assign to variable
    self.calenderPane = $element[0].querySelector('.sm-calender-pane');
    //button to start calender
    self.button = $element[0].querySelector('.sm-picker-icon');

    self.calenderPan = angular.element(self.calenderPane);

    // check if Pre defined format is supplied
    self.format = angular.isUndefined($scope.format) ? 'MM-DD-YYYY' : $scope.format;

    self.calenderPan.addClass('hide hide-animate');

    self.bodyClickHandler = angular.bind(self, self.clickOutSideHandler);

    self.$scope.$on('calender:close', function() {
        self.$document.off('keydown');
        self.hideElement();
    });

    self.$scope.$on('$destroy', function() {
        self.calenderPane.parentNode.removeChild(self.calenderPane);
    });


    // if tab out hide key board
    angular.element(self.inputPane).on('keydown', function(e) {
        switch(e.which){
            case 27:
            case 9:
                self.hideElement();
            break;
        }
    });

};

SMDateTimePickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
    var self = this;
    self.ngModelCtrl = ngModelCtrl;
    self.ngModelCtrl.$formatters.push(function(dateValue) {
        if(!dateValue && angular.isUndefined(dateValue)) {
            self.value='';
            self.onDateSelectedCall({date: null});
            return;
        }
        self.setNgModelValue(dateValue);
    });

};

SMDateTimePickerCtrl.prototype.setNgModelValue = function(date) {
    var self = this;
    self.onDateSelectedCall({date: date});
    var d = {};
    if (moment.isMoment(date)){
        d = date.format(self.format);
    } else {
        d = moment(date, self.format).format(self.format);
    }
    self.ngModelCtrl.$setViewValue(d);
    self.ngModelCtrl.$render();
    self.value = d;

};

SMDateTimePickerCtrl.prototype.onDateSelected = function(date){
    var self = this;
    self.setNgModelValue(date);
};



/*get visiable port

@param : elementnRect

@param : bodyRect

*/

SMDateTimePickerCtrl.prototype.getVisibleViewPort = function(elementRect, bodyRect) {
    var self = this;

    var top = elementRect.top;
    if (elementRect.top + self.calenderHeight > bodyRect.bottom) {
        top = elementRect.top - ((elementRect.top + self.calenderHeight) - (bodyRect.bottom - 20));
    }
    var left = elementRect.left;
    if (elementRect.left + self.calenderWidth > bodyRect.right) {
        left = elementRect.left - ((elementRect.left + self.calenderWidth) - (bodyRect.right - 10));
    }
    return {
        top: top,
        left: left
    };
}



SMDateTimePickerCtrl.prototype.show = function($event) {
    var self = this;


    var elementRect = self.inputPane.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();

    self.calenderPan.removeClass('hide hide-animate');

    if (self.$mdMedia('sm') || self.$mdMedia('xs')) {
        self.calenderPane.style.left = (bodyRect.width - 320) / 2 + 'px';
        self.calenderPane.style.top = (bodyRect.height - 450) / 2 + 'px';
    } else {
        var rect = self.getVisibleViewPort(elementRect, bodyRect);
        self.calenderPane.style.left = (rect.left) + 'px';
        self.calenderPane.style.top = (rect.top) + 'px';
    }


    document.body.appendChild(self.calenderPane);
    angular.element(self.calenderPane).focus();


    self.calenderPan.addClass('show');
    self.$mdUtil.disableScrollAround(self.calenderPane);


    self.isCalenderOpen =true;
    self.$document.on('click',self.bodyClickHandler);
}


SMDateTimePickerCtrl.prototype.tabOutEvent= function(element){
    var self = this;
    if (element.which === 9) {
        self.hideElement();
    }
}

SMDateTimePickerCtrl.prototype.hideElement= function() {
    var self = this;
    self.calenderPan.addClass('hide-animate');
    self.calenderPan.removeClass('show');
    self.$mdUtil.enableScrolling();

    if(self.button){
        angular.element(self.button).focus();
    }
    self.$document.off('click');
    self.isCalenderOpen =false;

}


SMDateTimePickerCtrl.prototype.clickOutSideHandler = function(e){
    var self = this;
    if(!self.button){
        if ((self.calenderPane !== e.target && self.inputPane !== e.target ) && (!self.calenderPane.contains(e.target) && !self.inputPane.contains(e.target))) {
            self.hideElement();
        }
    } else {
        if ((self.calenderPane !== e.target && self.button !== e.target ) && (!self.calenderPane.contains(e.target) && !self.button.contains(e.target))) {
            self.hideElement();
        }
    }
}


var app = angular.module('smDateTimeRangePicker');
app.directive('smDateTimePicker', ['$mdUtil', '$mdMedia', '$document', 'picker', DateTimePicker]);

/* global moment */
function picker(){
    var massagePath = 'X';
    var cancelLabel = 'Cancel';
    var okLabel = 'Ok';
    var clearLabel = 'Clear';
    var customRangeLabel = 'Custom Range';
    var format = 'MM-DD-YYYY';
    var customHeader ={
        date:'ddd, MMM DD',
        dateTime:'ddd, MMM DD HH:mm',
        time:'HH:mm',
    }

    //date picker configuration
    var daysNames = [
        {'single':'S', 'shortName':'Su', 'fullName':'Su startDate:nday'},
        {'single':'M', 'shortName':'Mo', 'fullName':'MonDay'},
        {'single':'T', 'shortName':'Tu', 'fullName':'TuesDay'},
        {'single':'W', 'shortName':'We', 'fullName':'Wednesday'},
        {'single':'T', 'shortName':'Th', 'fullName':'Thursday'},
        {'single':'F', 'shortName':'Fr', 'fullName':'Friday'},
        {'single':'S', 'shortName':'Sa', 'fullName':'Saturday'}
    ];

    var colorIntention = 'md-primary';    

    var dayHeader = 'single';

    var monthNames = moment.months();

    //range picker configuration
    var rangeDivider = 'To';
    var rangeDefaultList = [
        {
            label:'Today',
            startDate:moment().utc().startOf('day'),
            endDate:moment().utc().endOf('day')
        },
        {
            label:'Last 7 Days',
            startDate: moment().utc().subtract(7, 'd').startOf('day'),
            endDate:moment().utc().endOf('day')
        },
        {
            label:'This Month',
            startDate:moment().utc().startOf('month'),
            endDate: moment().utc().endOf('month')
        },
        {
            label:'Last Month',
            startDate:moment().utc().subtract(1, 'month').startOf('month'),
            endDate: moment().utc().subtract(1, 'month').endOf('month')
        },
        {
            label: 'This Quarter',
            startDate: moment().utc().startOf('quarter'),
            endDate: moment().utc().endOf('quarter')
        },
        {
            label:  'Year To Date',
            startDate:  moment().utc().startOf('year'),
            endDate:  moment().utc().endOf('day')
        },
        {
            label:  'This Year',
            startDate:  moment().utc().startOf('year'),
            endDate:  moment().utc().endOf('year')
        }
    ];

    var rangeCustomStartEnd =['Start Date', 'End Date'];


    return {
        setMassagePath : function(param){
            massagePath = param;
        },
        setDivider : function(value) {
            divider = value
        },
        setDaysNames : function(array){
            daysNames =array;
        },
        setMonthNames : function(array){
            monthNames = array;
        },
        setDayHeader : function(param){
            dayHeader = param;
        },
        setOkLabel : function(param){
            okLabel = param;
        },
        setCancelLabel : function(param){
            cancelLabel = param;
        },
        setClearLabel : function(param){
            clearLabel = param;
        },
        setCustomRangeLabel : function(param){
            customRangeLabel = param;
        },
        setRangeDefaultList : function(array){
            rangeDefaultList = array;
        },
        setRangeCustomStartEnd : function(array){
            rangeCustomStartEnd = array;
        },
        setColorIntention : function(theme){
            colorIntention = theme;
        },
        setCustomHeader : function(obj){
            if(!angular.isUndefined(obj.date)){
                customHeader.date= obj.date;
            }
            if(!angular.isUndefined(obj.dateTime)){
                customHeader.dateTime= obj.dateTime;
            }
            if(!angular.isUndefined(obj.time)){
                customHeader.time= obj.time;
            }
        },
        $get: function(){
            return {
                massagePath : massagePath,
                cancelLabel: cancelLabel,
                okLabel : okLabel,
                clearLabel : clearLabel,
                customRangeLabel: customRangeLabel,

                daysNames : daysNames,
                monthNames:monthNames,
                dayHeader :dayHeader,
                customHeader:customHeader,

                rangeDivider : rangeDivider,
                rangeCustomStartEnd : rangeCustomStartEnd,
                rangeDefaultList :rangeDefaultList,
                format : format,
                colorIntention :colorIntention
            }
        }
    }
}

var app = angular.module('smDateTimeRangePicker');
app.provider('picker', [picker]);

(function(){

    'use strict';

    function RangePickerInput($document,$mdMedia,$mdUtil,picker){
        return {
            restrict : 'EA',
            replace: true,
            require: ['^ngModel'],
            scope: {
                label: '@',
                fname: '@',
                isRequired: '@',
                closeOnSelect: '@',
                disable: '=',
                format: '@',
                mode: '@',
                divider: '@',
                showCustom: '@',
                value: '=ngModel',
                weekStartDay: '@',
                customToHome: '@',
                customList: '=',
                noFloatingLabel: '=',
                minDate: '@',
                maxDate: '@',
                allowClear: '@',
                allowEmpty: '@',
                onRangeSelect: '&'
            },
            controller: ['$scope', '$element', '$mdUtil', '$mdMedia', '$document', SMRangePickerCtrl],
            controllerAs: 'vm',
            bindToController:true,
            templateUrl: 'picker/range-picker-input.html',
            link: function(scope, $element, attr, ctrl){

                scope._watch_model = scope.$watch('vm.value', function(newVal, oldVal)
                    {
                        if(newVal && (newVal !== oldVal || !scope.vm.valueAsText))
                        {
                            if(typeof newVal === 'object')
                            {
                                if(newVal.__$toString)
                                {
                                    scope.vm.valueAsText = newVal.__$toString;
                                    delete newVal.__$toString;
                                }else
                                {
                                    var _temp = [];
                                    if(newVal.startDate)
                                    {
                                        _temp.push(moment(newVal.startDate).format(scope.vm.format || 'YYYY-MM-DD'));
                                    }else
                                    {
                                        _temp.push('Any');
                                    }
                                    _temp.push(scope.vm.divider);
                                    if(newVal.endDate)
                                    {
                                        _temp.push(moment(newVal.endDate).format(scope.vm.format || 'YYYY-MM-DD'));
                                    }else
                                    {
                                        _temp.push('Any');
                                    }

                                    scope.vm.valueAsText = _temp.join(' ');
                                }
                            }else //it must be removed in future releases once the input cannot be a string anymore.
                            {
                                scope.vm.valueAsText = scope.vm.value || '';
                            }
                        }
                    });

                //
            }
        };
    }

    var SMRangePickerCtrl = function($scope, $element, $mdUtil, $mdMedia, $document) {
        var self = this;
        self.$scope = $scope;
        self.$element = $element;
        self.$mdUtil = $mdUtil;
        self.$mdMedia = $mdMedia;
        self.$document = $document;
        self.isCalenderOpen = false;

        self.calenderHeight = 460;
        self.calenderWidth = 296;

        //find input button and assign to variable
        self.inputPane = $element[0].querySelector('.sm-input-container');

        //find Calender Picker  and assign to variable
        self.calenderPane = $element[0].querySelector('.sm-calender-pane');
        //button to start calender
        self.button = $element[0].querySelector('.sm-picker-icon');

        self.calenderPan = angular.element(self.calenderPane);

        //check if mode is undefied set to date mode
        self.mode = angular.isUndefined($scope.mode) ? 'date' : $scope.mode;
        // check if Pre defined format is supplied
        self.format = angular.isUndefined($scope.format) ? 'MM-DD-YYYY' : $scope.format;

        self.calenderPan.addClass('hide hide-animate');

        self.bodyClickHandler = angular.bind(self, self.clickOutSideHandler);

        self.$scope.$on('range-picker:close', function() {
            self.$document.off('keydown');
            self.hideElement();
        });

        self.$scope.$on('$destroy', function() {
            self.calenderPane.parentNode.removeChild(self.calenderPane);
            self.$scope._watch_model();
        });

        // if tab out hide key board
        angular.element(self.inputPane).on('keydown', function(e) {
            switch(e.which){
                case 27:
                case 9:
                self.hideElement();
                break;
            }
        });
    };


    /*get visiable port
    @param : elementnRect
    @param : bodyRect
    */
    SMRangePickerCtrl.prototype.getVisibleViewPort = function(elementRect, bodyRect) {
        var self = this;

        var top = elementRect.top;
        if (elementRect.top + self.calenderHeight > bodyRect.bottom) {
            top = elementRect.top - ((elementRect.top + self.calenderHeight) - (bodyRect.bottom - 20));
        }
        var left = elementRect.left;
        if (elementRect.left + self.calenderWidth > bodyRect.right) {
            left = elementRect.left - ((elementRect.left + self.calenderWidth) - (bodyRect.right - 10));
        }
        return {
            top: top,
            left: left
        };
    };

    SMRangePickerCtrl.prototype.rangeSelected = function(range){
        var self = this;
        self.onRangeSelect({range: range});
        self.value = {startDate: range.startDateAsMoment, endDate: range.endDateAsMoment, __$toString: range.text};
    };


    SMRangePickerCtrl.prototype.show = function($event) {
        var self = this;
        var elementRect = self.inputPane.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();

        self.calenderPan.removeClass('hide hide-animate');

        if (self.$mdMedia('sm') || self.$mdMedia('xs')) {
            self.calenderPane.style.left = (bodyRect.width - 320) / 2 + 'px';
            self.calenderPane.style.top = (bodyRect.height - 450) / 2 + 'px';
        } else {
            var rect = self.getVisibleViewPort(elementRect, bodyRect);
            self.calenderPane.style.left = (rect.left) + 'px';
            self.calenderPane.style.top = (rect.top) + 'px';
        }


        document.body.appendChild(self.calenderPane);
        angular.element(self.calenderPane).focus();


        self.calenderPan.addClass('show');
        self.$mdUtil.disableScrollAround(self.calenderPane);
        self.$document.on('click', self.bodyClickHandler);
    };


    SMRangePickerCtrl.prototype.tabOutEvent= function(element){
        var self = this;
        if (element.which === 9) {
            self.hideElement();
        }
    };

    SMRangePickerCtrl.prototype.hideElement= function() {
        var self = this;
        self.calenderPan.addClass('hide-animate');
        self.calenderPan.removeClass('show');
        self.$mdUtil.enableScrolling();

        if(self.button){
            angular.element(self.button).focus();
        }
        self.$document.off('click');
        self.isCalenderOpen =false;
    };


    SMRangePickerCtrl.prototype.clickOutSideHandler = function(e){
        var self = this;
        if(e.target && e.target.nodeName === 'BODY')
        {
            return;
        }

        if(!self.button){
            if (( self.calenderPane !== e.target && self.inputPane !== e.target ) &&
                (!self.calenderPane.contains(e.target) && !self.inputPane.contains(e.target) ) )
            {
                //(!self.calenderPane.contains(e.target) && !self.inputPane.contains(e.target))) {
                self.$scope.$broadcast('range-picker-input:blur');
                self.hideElement();
            }
        }else{
            if ((self.calenderPane !== e.target && self.button !== e.target ) &&
                (!self.calenderPane.contains(e.target) && !self.button.contains(e.target))) {
                self.hideElement();
            }
        }
    };

    var app = angular.module('smDateTimeRangePicker');
    app.directive('smRangePickerInput', ['$document', '$mdMedia', '$mdUtil', 'picker', RangePickerInput]);
})();

/* global moment */
function smRangePicker (picker){
    return{
        restrict : 'E',
        require : ['^?ngModel', 'smRangePicker'],
        scope:{
            format:'@',
            divider: '@',
            weekStartDay :'@',
            customToHome: '@',
            closeOnSelect: '@',
            mode: '@',
            showCustom:'@',
            customList: '=',
            minDate : '@',
            maxDate : '@',
            allowClear: '@',
            allowEmpty: '@',
            rangeSelectCall : '&'
        },
        terminal:true,
        controller: ['$scope', 'picker', RangePickerCtrl],
        controllerAs : 'vm',
        bindToController:true,
        templateUrl : 'picker/range-picker.html',
        link : function(scope, element, att, ctrls){
            var ngModelCtrl = ctrls[0];
            var calCtrl = ctrls[1];
            calCtrl.configureNgModel(ngModelCtrl);
        }
    };
}

var RangePickerCtrl = function($scope, picker){
    var self = this;
    self.scope = $scope;
    self.clickedButton = 0;
    self.startShowCustomSettting =self.showCustom;


    self.startDate = moment();
    self.endDate = moment();

    self.divider = angular.isUndefined(self.scope.divider) || self.scope.divider ===''? picker.rangeDivider : $scope.divider;

    //display the clear button?
    self.showClearButton = self.allowClear === 'true' || false;
    //allow set start/end date as empty value
    self.allowEmptyDates = self.allowEmpty === 'true' || false;

    self.okLabel = picker.okLabel;
    self.cancelLabel = picker.cancelLabel;
    self.clearLabel = picker.clearLabel;
    self.customRangeLabel = picker.customRangeLabel;
    self.view = 'DATE';

    self.rangeCustomStartEnd = picker.rangeCustomStartEnd;
    var defaultList = [];
    angular.copy(picker.rangeDefaultList, defaultList);
    self.rangeDefaultList = defaultList;
    if(self.customList){
        for (var i = 0; i < self.customList.length; i++) {
            self.rangeDefaultList[self.customList[i].position] = self.customList[i];
        }
    }

    if(self.showCustom){
        self.selectedTabIndex=0;
    }else{
        self.selectedTabIndex = $scope.selectedTabIndex;
    }

    $scope.$on('range-picker-input:blur', function()
    {
        self.cancel();
    });

};

RangePickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
    this.ngModelCtrl = ngModelCtrl;
    var self = this;
    ngModelCtrl.$render = function() {
        //self.ngModelCtrl.$viewValue= self.startDate+' '+ self.divider +' '+self.endDate;
    };
};

RangePickerCtrl.prototype.setNextView = function(){
    switch (this.mode){
        case 'date':
        this.view = 'DATE';
        if(this.selectedTabIndex ===0 ){
            this.selectedTabIndex =1;
        }
        break;
        case 'date-time':
        if(this.view === 'DATE'){
            this.view = 'TIME';
        }else{
            this.view = 'DATE';
            if(this.selectedTabIndex ===0 ){
                this.selectedTabIndex =1;
            }
        }
        break;
        default:
        this.view = 'DATE';
        if(this.selectedTabIndex ===0 ){
            this.selectedTabIndex =1;
        }
    }
};

RangePickerCtrl.prototype.showCustomView = function(){
    this.showCustom=true;
    this.selectedTabIndex=0;

};

RangePickerCtrl.prototype.dateRangeSelected = function(){
    var self = this;
    self.selectedTabIndex =0;
    self.view= 'DATE';
    if(self.startShowCustomSettting){
        self.showCustom=true;
    }else{
        self.showCustom=false;
    }
    self.setNgModelValue(self.startDate, self.divider, self.endDate);
};

/* sets an empty value on dates. */
RangePickerCtrl.prototype.clearDateRange = function(){
    var self = this;
    self.selectedTabIndex =0;
    self.view= 'DATE';
    if(self.startShowCustomSettting){
        self.showCustom=true;
    }else{
        self.showCustom=false;
    }
    self.setNgModelValue('', self.divider, '');
};


RangePickerCtrl.prototype.startDateSelected = function(date){
    var _date_copy = angular.copy(date);
    this.startDate = _date_copy;
    this.minStartToDate = _date_copy;
    this.scope.$emit('range-picker:startDateSelected');
    this.setNextView();
    if (this.endDate && this.endDate.diff(this.startDate, 'ms') < 0) {
        this.endDate = date;
    }
};

RangePickerCtrl.prototype.startTimeSelected = function(time){

    this.startDate.hour(time.hour()).minute(time.minute());
    this.minStartToDate = angular.copy(this.startDate);
    this.scope.$emit('range-picker:startTimeSelected');
    this.setNextView();
};


RangePickerCtrl.prototype.endDateSelected = function(date){
    this.endDate = date;
    this.scope.$emit('range-picker:endDateSelected');
    if(this.closeOnSelect && this.mode==='date'){
        this.setNgModelValue(this.startDate, this.divider, this.endDate);
    }else{
        this.setNextView();
    }
};

RangePickerCtrl.prototype.endTimeSelected = function(time){
    this.endDate.hour(time.hour()).minute(time.minute());
    this.scope.$emit('range-picker:endTimeSelected');
    if(this.closeOnSelect && this.mode==='date-time'){
        this.setNgModelValue(this.startDate, this.divider, this.endDate);
    }
};



RangePickerCtrl.prototype.setNgModelValue = function(startDate, divider, endDate) {
    var self = this;
    var momentStartDate = self.startDate = startDate || null;
    var momentEndDate = self.endDate = endDate || null;


    if(startDate)
    {
        startDate = startDate.format(self.format) || '';
    }

    if(endDate)
    {
        endDate = endDate.format(self.format) || '';
    }

  var range = {startDate: startDate, endDate: endDate, startDateAsMoment: momentStartDate, endDateAsMoment: momentEndDate};

    //var range = {startDate: startDate, endDate: endDate};
    var _ng_model_value;

    //if no startDate && endDate, then empty the model.
    if(!startDate && !endDate)
    {
        _ng_model_value = '';
    }else
    {
        startDate = startDate || 'Any';
        endDate = endDate || 'Any';
        _ng_model_value = startDate + ' ' + divider + ' ' + endDate;
    }

    range.text = _ng_model_value;
    
    self.rangeSelectCall({range: range});
    
    /*
    setTimeout(function()
    {
        self.ngModelCtrl.$setViewValue(_ng_model_value);
        self.ngModelCtrl.$render();
    }, 50);
    */
    
    self.selectedTabIndex = 0;
    self.view ='DATE';
    self.scope.$emit('range-picker:close');
};


RangePickerCtrl.prototype.cancel = function() {
    var self = this;
    if(self.customToHome && self.showCustom) {
        self.showCustom=false;
    }else{
        self.selectedTabIndex =0;
        self.showCustom=false;
        self.scope.$emit('range-picker:close');
    }
};

var app = angular.module('smDateTimeRangePicker');
app.directive('smRangePicker', ['picker', smRangePicker]);

/* global moment */
function smTimePickerNew($mdUtil, $mdMedia, $document, $timeout, picker){
    return {
        restrict : 'E',
        replace:true,
        scope :{
            value: '=',
            startDate : '@',
            weekStartDay : '@',
            startView:'@',
            mode : '@',
            format : '@',
            minDate : '@',
            maxDate : '@',
            fname : '@',
            lable : '@',
            isRequired : '@',
            disable : '=',
            form : '=',
            closeOnSelect:'@'
        },
        templateUrl: 'picker/sm-time-picker.html',
        link :  function(scope, $element, attr){
            var inputPane = $element[0].querySelector('.sm-input-container');
            var calenderPane = $element[0].querySelector('.sm-calender-pane');
            var cElement = angular.element(calenderPane);
            scope.ngMassagedTempaltePath =picker.massagePath;
            // check if Pre defined format is supplied
            scope.format = angular.isUndefined(scope.format) ? 'MM-DD-YYYY': scope.format;


            // Hide calender pane on initialization
            cElement.addClass('hide hide-animate');

            // set start date
            scope.startDate = angular.isUndefined(scope.value)? scope.startDate : scope.value;

            // Hide Calender on click out side
            $document.on('click', function (e) {
                if ((calenderPane !== e.target && inputPane !==e.target) && (!calenderPane.contains(e.target) && !inputPane.contains(e.target))) {
                    hideElement();
                }
            });

            // if tab out hide key board
            angular.element(inputPane).on('keydown', function (e) {
                if(e.which===9){
                    hideElement();
                }
            });

            // show calender
            scope.show= function(){
                var elementRect = inputPane.getBoundingClientRect();
                var bodyRect = document.body.getBoundingClientRect();

                cElement.removeClass('hide');
                if($mdMedia('sm') || $mdMedia('xs')){
                    calenderPane.style.left = (bodyRect.width-300)/2+'px';
                    calenderPane.style.top = (bodyRect.height-450)/2+ 'px';
                }else{
                    var rect = getVisibleViewPort(elementRect, bodyRect);
                    calenderPane.style.left = (rect.left) + 'px';
                    calenderPane.style.top = (rect.top) + 'px';
                }
                document.body.appendChild(calenderPane);
                $mdUtil.disableScrollAround(calenderPane);
                cElement.addClass('show');
            }

            // calculate visible port to display calender
            function getVisibleViewPort(elementRect, bodyRect){
                var calenderHeight = 460;
                var calenderWidth = 296;

                var top =elementRect.top;
                if(elementRect.top +calenderHeight > bodyRect.bottom){
                    top = elementRect.top - ((elementRect.top +calenderHeight) - (bodyRect.bottom -20));
                }
                var left = elementRect.left;
                if(elementRect.left +calenderWidth > bodyRect.right){
                    left = elementRect.left - ((elementRect.left +calenderWidth) - (bodyRect.right -10));
                }
                return {top : top, left : left };
            }

            function hideElement(){
                cElement.addClass('hide-animate');
                cElement.removeClass('show');
                //this is only for animation
                //calenderPane.parentNode.removeChild(calenderPane);
                $mdUtil.enableScrolling();
            }

            scope.$on('$destroy', function(){
                calenderPane.parentNode.removeChild(calenderPane);
            });

            //listen to emit for closing calender
            scope.$on('calender:close', function(){
                hideElement();
            });
        }
    }
}

var app = angular.module('smDateTimeRangePicker');
app.directive('smTimePickerNew', ['$mdUtil', '$mdMedia', '$document', '$timeout', 'picker', smTimePickerNew]);

}());

angular.module("smDateTimeRangePicker").run(["$templateCache", function($templateCache) {$templateCache.put("picker/calender-date.html","<div class=\"date-picker\">\n    <div ng-class=\"{\'year-container\' : vm.view===\'YEAR_MONTH\'}\" ng-show=\"vm.view===\'YEAR_MONTH\'\" layout=\"column\">\n        <a href=\"javascript:void(0)\" class=\"cal-link\" ng-click=\"vm.view = \'DATE\'\">Back to calendar</a>\n        <md-virtual-repeat-container class=\"year-md-repeat\" id=\"year-container\" md-top-index=\"vm.yearTopIndex\">\n            <div class=\"repeated-item\" md-on-demand=\"\" md-virtual-repeat=\"yr in vm.yearItems\">\n                    <div class=\"year\" ng-class=\"{\'md-accent\': yr === vm.currentDate.year(), \'selected-year md-primary \':vm.initialDate.year()===yr}\">\n                         <span class=\"year-num\" ng-click=\"vm.changeYear(yr,vm.currentDate.month())\">{{yr}}</span> \n                         <div class=\"month-list\">\n                            <div class=\"month-row\" >\n                                <span ng-click=\"vm.changeYear(yr,0)\" class=\"month\">{{vm.monthList[0]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,1)\" class=\"month\">{{vm.monthList[1]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,2)\" class=\"month\">{{vm.monthList[2]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,3)\" class=\"month\">{{vm.monthList[3]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,4)\" class=\"month\">{{vm.monthList[4]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,5)\" class=\"month\">{{vm.monthList[5]}}</span>\n                            </div>\n                                <div  class=\"month-row\">\n                                <span ng-click=\"vm.changeYear(yr,6)\" class=\"month\">{{vm.monthList[6]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,7)\" class=\"month\">{{vm.monthList[7]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,8)\" class=\"month\">{{vm.monthList[8]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,9)\" class=\"month\">{{vm.monthList[9]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,10)\" class=\"month\">{{vm.monthList[10]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,11)\" class=\"month\">{{vm.monthList[11]}}</span>\n                            </div>\n                         </div>                  \n                    </div>\n                    <md-divider></md-divider>\n            </div>\n        </md-virtual-repeat-container>\n    </div>\n    <div ng-class=\"{\'date-container\' : vm.view===\'DATE\'}\" ng-show=\"vm.view===\'DATE\'\">\n        <div class=\"navigation\" layout=\"row\" layout-align=\"space-between center\">\n            <md-button aria-label=\"previous\" class=\"md-icon-button scroll-button\" ng-click=\"vm.changePeriod(\'p\')\" ng-disabled=\"vm.stopScrollPrevious\">\n                <svg height=\"18\" viewbox=\"0 0 18 18\" width=\"18\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path d=\"M15 8.25H5.87l4.19-4.19L9 3 3 9l6 6 1.06-1.06-4.19-4.19H15v-1.5z\">\n                    </path>\n                </svg>\n            </md-button>\n            <md-button aria-label=\"Change Year\" class=\"md-button\" md-no-ink=\"\" ng-class=\"vm.moveCalenderAnimation\" ng-click=\"vm.changeView(\'YEAR_MONTH\')\">\n                {{vm.monthList[vm.initialDate.month()]}}{{\' \'}}{{vm.initialDate.year()}}\n            </md-button>\n            <md-button aria-label=\"next\" class=\"md-icon-button scroll-button\" ng-click=\"vm.changePeriod(\'n\')\" ng-disabled=\"vm.stopScrollNext\">\n                <svg height=\"18\" viewbox=\"0 0 18 18\" width=\"18\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path d=\"M9 3L7.94 4.06l4.19 4.19H3v1.5h9.13l-4.19 4.19L9 15l6-6z\">\n                    </path>\n                </svg>\n            </md-button>\n        </div>\n        <div class=\"date-cell-header\">\n            <md-button class=\"md-icon-button\" ng-disabled=\"true\" ng-repeat=\"dHead in vm.dateCellHeader\">\n                {{dHead[vm.dayHeader]}}\n            </md-button>\n        </div>\n        <div class=\"date-cell-row\" md-swipe-left=\"vm.changePeriod(\'n\')\" md-swipe-right=\"vm.changePeriod(\'p\')\" ng-class=\"vm.moveCalenderAnimation\">\n            <div layout=\"row\" ng-repeat=\"w in vm.dateCells\">\n                <md-button aria-label=\"vm.currentDate\" class=\"date-cell md-icon-button\" ng-class=\"{\'{{vm.colorIntention}} sm-today\' : d.today,\n								\'active\':d.isCurrentMonth,\n								\'{{vm.colorIntention}} md-raised selected\' :d.date.isSame(vm.currentDate),\n								\'disabled\':d.isDisabledDate}\" ng-click=\"vm.selectDate(d.date,d.isDisabledDate)\" ng-disabled=\"d.isDisabledDate\" ng-repeat=\"d in w\">\n                    <span>\n                        {{d.dayNum}}\n                    </span>\n                </md-button>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("picker/calender-hour.html","<div  class=\"time-picker\" layout=\"row\" layout-align=\"center center\">\n	<div>\n		<div layout=\"row\" class=\"navigation\">\n			<span class=\"md-button\">Hour</span>\n			<span class=\"md-button\">Minute</span>\n		</div>\n		<div layout=\"row\" >\n			<md-virtual-repeat-container flex=\"50\"  id=\"hour-container{{vm.uid}}\" class=\"time-md-repeat\" md-top-index=\"vm.hourTopIndex\">\n			<div ng-repeat=\"h in vm.hourItems\" class=\"repeated-item\">\n						<md-button class=\"md-icon-button\" \n							ng-click=\"vm.setHour(h.hour)\" 							\n							ng-class=\"{\'{{vm.colorIntention}}\': h.isCurrent,\n									\'{{vm.colorIntention}} md-raised\' :h.hour===vm.currentDate.hour()}\">\n							{{h.hour}}\n						</md-button>\n			</div>\n			</md-virtual-repeat-container>		     \n			<md-virtual-repeat-container flex=\"50\" id=\"minute-container\" class=\"time-md-repeat\" md-top-index=\"vm.minuteTopIndex\">\n				<div ng-repeat=\"m in vm.minuteCells\"  class=\"repeated-item\">\n						<md-button class=\"md-icon-button\" \n							ng-click=\"vm.setMinute(m.minute)\" 							\n							ng-class=\"{\'{{vm.colorIntention}}\': m.isCurrent,\n								\'{{vm.colorIntention}} md-raised\' :m.minute===vm.currentDate.minute()}\">\n							{{m.minute}}\n						</md-button>\n				</div>\n			</md-virtual-repeat-container>		     \n		</div>	\n	</div>\n</div>");
$templateCache.put("picker/date-picker-service.html","<md-dialog class=\"picker-container  md-whiteframe-15dp\" aria-label=\"picker\">\n	<md-content  layout-xs=\"column\" layout=\"row\"  class=\"container\" >\n		<md-toolbar class=\"md-height\" ng-class=\"{\'portrait\': !vm.$mdMedia(\'gt-xs\'),\'landscape\': vm.$mdMedia(\'gt-xs\')}\" >			\n				<span class=\"year-header\" layout=\"row\" layout-xs=\"row\">{{vm.viewDate.format(\'YYYY\')}}</span>\n				<span class=\"date-time-header\" layout=\"row\" layout-xs=\"row\">{{vm.viewDate.format(vm.headerDispalyFormat)}}</span>\n		</md-toolbar>\n		<div layout=\"column\" class=\"picker-container\" >\n			<div ng-if=\"vm.view===\'DATE\'\" >\n				<sm-calender \n					ng-model=\"vm.selectedDate\"\n					initial-date=\"vm.initialDate\"\n					id=\"{{vm.fname}}Picker\" \n					data-mode=\"{{vm.mode}}\" \n					data-min-date=\"vm.minDate\" \n					data-max-date=\"vm.maxDate\" \n					close-on-select=\"{{vm.closeOnSelect}}\"				 \n					data-format=\"{{vm.format}}\"  \n					data-week-start-day=\"{{vm.weekStartDay}}\"\n					date-select-call=\"vm.dateSelected(date)\">\n				</sm-calender>\n			</div>\n			<div ng-show=\"vm.view===\'HOUR\'\">\n				<sm-time\n					ng-model=\"vm.selectedTime\"\n					data-format=\"HH:mm\"\n					time-select-call=\"vm.timeSelected(time)\">\n				</sm-time>\n			</div>		\n 			<div layout=\"row\" ng-hide=\"vm.closeOnSelect && (vm.mode!==\'date-time\' || vm.mode!==\'time\')\">\n<!-- 					<div ng-show=\"vm.mode===\'date-time\'\">\n						<md-button class=\"md-icon-button\" ng-show=\"vm.view===\'DATE\'\" ng-click=\"vm.view=\'HOUR\'\">\n							<md-icon md-font-icon=\"material-icons md-primary\">access_time</md-icon>\n						</md-button>				\n						<md-button class=\"md-icon-button\" ng-show=\"vm.view===\'HOUR\'\" ng-click=\"vm.view=\'DATE\'\">\n							<md-icon md-font-icon=\"material-icons md-primary\">date_range</md-icon>\n						</md-button>\n					</div>												\n -->					<span flex></span>\n					<md-button class=\"md-button md-primary\" ng-click=\"vm.closeDateTime()\">{{vm.cancelLabel}}</md-button>\n					<md-button class=\"md-button md-primary\" ng-click=\"vm.selectedDateTime()\">{{vm.okLabel}}</md-button>\n			</div>\n		</div>\n	</md-content>	\n</md-dialog>");
$templateCache.put("picker/date-picker.html","<div class=\"picker-container\">\n	<md-content  layout-xs=\"column\" layout=\"row\"  class=\"container\" >\n		<md-toolbar class=\"md-height {{vm.colorIntention}}\" ng-class=\"{\'portrait\': !vm.$mdMedia(\'gt-xs\'),\'landscape\': vm.$mdMedia(\'gt-xs\')} \" >			\n				<span class=\"year-header\" layout=\"row\" layout-xs=\"row\">{{vm.currentDate.format(\'YYYY\')}}</span>\n				<span class=\"date-time-header\" layout=\"row\" layout-xs=\"row\">{{vm.currentDate.format(vm.headerDispalyFormat)}}</span>\n		</md-toolbar>\n		<div layout=\"column\" class=\"picker-container\" >\n			<div ng-show=\"vm.view===\'DATE\'\" >\n				<sm-calender \n					data-initial-date=\"vm.initialDate\"					\n					data-id=\"{{vm.fname}}Picker\" \n					data-mode=\"{{vm.mode}}\" \n					data-min-date=\"vm.minDate\" \n					data-max-date=\"vm.maxDate\" \n					data-close-on-select=\"{{vm.closeOnSelect}}\"				 \n					data-format=\"{{vm.format}}\" \n					data-disable-year-selection=\"{{vm.disableYearSelection}}\" \n					data-week-start-day=\"{{vm.weekStartDay}}\"\n					data-date-select-call=\"vm.dateSelected(date)\">\n				</sm-calender>\n			</div>\n			<div ng-show=\"vm.view===\'TIME\'\">\n				<sm-time\n					data-ng-model=\"vm.selectedTime\"\n					data-format=\"HH:mm\"\n					data-time-select-call=\"vm.timeSelected(time)\">\n				</sm-time>\n			</div>		\n			<div layout=\"row\" ng-hide=\"vm.closeOnSelect\">\n					<span flex></span>\n					<md-button class=\"md-button buttonSelect {{vm.colorIntention}}\" ng-click=\"vm.closeDateTime()\">{{vm.cancelLabel}}</md-button>\n					<md-button class=\"md-button buttonCancel {{vm.colorIntention}}\" ng-click=\"vm.selectedDateTime()\">{{vm.okLabel}}</md-button>\n			</div>\n		</div>\n	</md-content>	\n</div>");
$templateCache.put("picker/range-picker-input.html","<md-input-container md-no-float=\"vm.noFloatingLabel\">\n\n    <input name=\"{{vm.fname}}\" ng-model=\"vm.valueAsText\" ng-readonly=\"true\"\n        type=\"text\"\n        aria-label=\"{{vm.fname}}\" ng-required=\"{{vm.isRequired}}\" class=\"sm-input-container\"\n        ng-focus=\"vm.show()\" placeholder=\"{{vm.label}}\"\n    />\n    <div id=\"picker\" class=\"sm-calender-pane md-whiteframe-4dp\" ng-model=\"value\">\n        <sm-range-picker\n            ng-model=\"vm.value\"\n            custom-to-home=\"{{vm.customToHome}}\"\n            custom-list=\"vm.customList\"\n            mode=\"{{vm.mode}}\"\n            min-date=\"{{vm.minDate}}\"\n            max-date=\"{{vm.maxDate}}\"\n            range-select-call=\"vm.rangeSelected(range)\"\n            close-on-select=\"{{vm.closeOnSelect}}\"\n            show-custom=\"{{vm.showCustom}}\"\n            week-start-day=\"{{vm.weekStartDay}}\"\n            divider=\"{{vm.divider}}\"\n            format=\"{{vm.format}}\"\n            allow-clear=\"{{vm.allowClear}}\"\n            allow-empty=\"{{vm.allowEmpty}}\"\n        ></sm-range-picker>\n    </div>\n</md-input-container>\n");
$templateCache.put("picker/range-picker.html","<md-content layout=\"column\"  id=\"{{id}}\" class=\"range-picker md-whiteframe-2dp\" >\n    <md-toolbar layout=\"row\"  class=\"md-primary\" >\n      	<div class=\"md-toolbar-tools\"  layout-align=\"space-around center\">\n			<div  class=\"date-display\"><span>{{vm.startDate.format(vm.format)}}</span></div>\n			<div   class=\"date-display\"><span>{{vm.endDate.format(vm.format)}}</span></div>\n		</div>\n	</md-toolbar>\n	<div  layout=\"column\" class=\"pre-select\"  role=\"button\" ng-show=\"!vm.showCustom\">\n		<md-button\n			 aria-label=\"{{list.label}}\"\n			 ng-click=\"vm.setNgModelValue(list.startDate,vm.divider,list.endDate)\"\n			 ng-repeat=\"list in vm.rangeDefaultList | limitTo:6\">{{list.label}}\n		 </md-button>\n		<md-button aria-label=\"Custom Range\"  ng-click=\"vm.showCustomView()\">{{vm.customRangeLabel}}</md-button>\n	</div>\n	<div layout=\"column\" class=\"custom-select\" ng-if=\"vm.showCustom\" ng-class=\"{\'show-calender\': vm.showCustom}\">\n		<div layout=\"row\"   class=\"tab-head\">\n			<!--<span  ng-class=\"{\'active moveLeft\':vm.selectedTabIndex===0}\">{{vm.rangeCustomStartEnd[0]}}</span>-->\n			<a class=\"start-btn\" href=\"javascript:void(0)\" ng-click=\"vm.selectedTabIndex = 0;\">\n				<span>{{vm.rangeCustomStartEnd[0]}}</span>\n			</a>\n			<span  ng-class=\"{\'active moveLeft\':vm.selectedTabIndex===1}\">{{vm.rangeCustomStartEnd[1]}}</span>\n		</div>\n		<div ng-show=\"vm.selectedTabIndex===0\" ng-model=\"vm.startDate\" >\n			<div layout=\"row\" ng-if=\"vm.allowEmptyDates\" ng-click=\"vm.startDateSelected(\'\')\">\n				<md-button class=\"md-warn\"><small>No start date</small></md-button>\n			</div>\n			<sm-calender\n				ng-show=\"vm.view===\'DATE\'\"\n				week-start-day=\"{{vm.weekStartDay}}\"\n				min-date=\"vm.minDate\"\n				max-date=\"vm.maxDate\"\n				format=\"{{vm.format}}\"\n				date-select-call=\"vm.startDateSelected(date)\">\n			</sm-calender>\n			<sm-time\n				ng-show=\"vm.view===\'TIME\'\"\n				ng-model=\"selectedStartTime\"\n				time-select-call=\"vm.startTimeSelected(time)\">\n			</sm-time>\n		</div>\n		<div ng-if=\"vm.selectedTabIndex===1\" ng-model=\"vm.endDate\" >\n			<div layout=\"row\" layout-align=\"end\" ng-if=\"vm.allowEmptyDates\" ng-click=\"vm.endDateSelected(\'\')\">\n				<md-button class=\"md-warn\"><small>No end date</small></md-button>\n			</div>\n			<sm-calender\n				format=\"{{vm.format}}\"\n				ng-show=\"vm.view===\'DATE\'\"\n				initial-date=\"vm.minStartToDate.format(vm.format)\"\n				min-date=\"vm.minStartToDate\"\n				max-date=\"vm.maxDate\"\n				week-start-day=\"{{vm.weekStartDay}}\"\n				date-select-call=\"vm.endDateSelected(date)\">\n			</sm-calender>\n			<sm-time\n				ng-show=\"vm.view===\'TIME\'\"\n				ng-model=\"selectedEndTime\"\n				time-select-call=\"vm.endTimeSelected(time)\">\n			</sm-time>\n		</div>\n	</div>\n	<div layout=\"row\" layout-align=\"end center\">\n		<md-button type=\"button\" class=\"md-warn\" ng-if=\"vm.showClearButton\" ng-click=\"vm.clearDateRange()\">{{vm.clearLabel}}</md-button>\n		<span flex></span>\n		<md-button type=\"button\" class=\"md-primary\" ng-click=\"vm.cancel()\">{{vm.cancelLabel}}</md-button>\n		<md-button type=\"button\" class=\"md-primary\" ng-click=\"vm.dateRangeSelected()\">{{vm.okLabel}}</md-button>\n	</div>\n</md-content>\n");
$templateCache.put("picker/sm-time-picker.html","<md-input-container>\n    <label for=\"{{fname}}\">{{lable }}</label>\n    <input name=\"{{fname}}\" ng-model=\"value\" ng-readonly=\"true\"\n        type=\"text\" placeholde=\"{{lable}}\"\n        aria-label=\"{{fname}}\" data-ng-required=\"isRequired\"\n        ng-focus=\"show()\" server-error class=\"sm-input-container\"\n    />\n    <div ng-messages=\"form.fname.$error\" ng-if=\"form[fname].$touched\">\n        <div ng-messages-include=\"{{ngMassagedTempaltePath}}\"></div>\n    </div>\n    <div id=\"picker\" class=\"sm-calender-pane md-whiteframe-15dp\">\n        <sm-time-picker\n            id=\"{{fname}}Picker\"\n            ng-model=\"value\"\n            initial-date=\"{{value}}\"\n            mode=\"{{mode}}\"\n            close-on-select=\"{{closeOnSelect}}\"\n            start-view=\"{{startView}}\"\n            data-min-date=\"minDate\"\n            data-max-date=\"maxDate\"\n            format=\"{{format}}\"\n            start-day=\"{{weekStartDay}}\"\n        ></sm-time-picker>\n    </div>\n</md-input-container>\n");
$templateCache.put("picker/time-picker.html","<div class=\"picker-container  md-whiteframe-15dp\">\n	<md-content  layout-xs=\"column\" layout=\"row\"  class=\"container\" >\n		<md-toolbar class=\"md-height\" ng-class=\"{\'portrait\': !$mdMedia(\'gt-xs\'),\'landscape\': $mdMedia(\'gt-xs\')}\" >			\n				<span class=\"year-header\" layout=\"row\" layout-xs=\"row\">{{currentDate.format(\'YYYY\')}}</span>\n				<span class=\"date-time-header\" layout=\"row\" layout-xs=\"row\">{{currentDate.format(headerDispalyFormat)}}</span>\n		</md-toolbar>\n		<div layout=\"column\" class=\"picker-container\" >\n			<sm-time\n				ng-model=\"selectedTime\"\n				data-format=\"HH:mm\">\n			</sm-time>\n			<div layout=\"row\" ng-hide=\"closeOnSelect && (mode!==\'date-time\' || mode!==\'time\')\">\n					<div ng-show=\"mode===\'date-time\'\">\n						<md-button class=\"md-icon-button\" ng-show=\"view===\'DATE\'\" ng-click=\"view=\'HOUR\'\">\n							<md-icon md-font-icon=\"material-icons md-primary\">access_time</md-icon>\n						</md-button>				\n						<md-button class=\"md-icon-button\" ng-show=\"view===\'HOUR\'\" ng-click=\"view=\'DATE\'\">\n							<md-icon md-font-icon=\"material-icons md-primary\">date_range</md-icon>\n						</md-button>\n					</div>												\n					<span flex></span>\n					<md-button class=\"md-button md-primary\" ng-click=\"closeDateTime()\">{{cancelLabel}}</md-button>\n					<md-button class=\"md-button md-primary\" ng-click=\"selectedDateTime()\">{{okLabel}}</md-button>\n			</div>\n		</div>\n	</md-content>	\n</div>");}]);