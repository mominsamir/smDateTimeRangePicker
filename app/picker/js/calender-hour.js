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
			controller:['$scope', '$timeout', TimePickerCtrl],
			controllerAs : 'vm',
			templateUrl:'picker/calender-hour.html',
			link : function(scope, element, att, ctrls){
				var ngModelCtrl = ctrls[0];
				var calCtrl = ctrls[1];
				calCtrl.configureNgModel(ngModelCtrl);

			}
		}
	}

	var TimePickerCtrl = function($scope, $timeout){
		var self = this;
		self.uid = Math.random().toString(36).substr(2, 5);
		self.$scope = $scope;
		self.$timeout = $timeout;
		self.initialDate = $scope.initialTime; 	//if calender to be  initiated with specific date
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
