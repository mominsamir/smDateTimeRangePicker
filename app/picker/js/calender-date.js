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
