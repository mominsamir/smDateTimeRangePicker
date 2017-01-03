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
		}
	}

	var PickerCtrl = function($scope, picker, $mdMedia){
		var self = this;
		self.scope = $scope;
		self.okLabel = picker.okLabel;
		self.cancelLabel = picker.cancelLabel;
		self.picker = picker;
		self.$mdMedia =$mdMedia;
		self.init();

	}

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
			self.view = 'DATE'
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
	}

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
	}

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

	}

	PickerCtrl.prototype.dateSelected = function(date){
		var self = this;

		self.currentDate.date(date.date()).month(date.month()).year(date.year());
		self.selectedDate = self.currentDate;
		if(self.closeOnSelect && self.mode==='date'){
			self.selectedDateTime();
		}else{
			self.setNextView();
		}
	}

	PickerCtrl.prototype.timeSelected = function(time){
		var self = this;
		self.currentDate.hours(time.hour()).minutes(time.minute());
		self.selectedTime= self.currentDate;

		if(self.closeOnSelect && self.mode==='date-time')
			self.selectedDateTime();
		else
			self.setNextView();
	}

	PickerCtrl.prototype.setNgModelValue = function(date) {
		var self = this;
		self.onSelectCall({date: date});
		self.ngModelCtrl.$setViewValue(date.format(self.format));
		self.ngModelCtrl.$render();
		self.closeDateTime();

	};


	PickerCtrl.prototype.closeDateTime = function(){
		this.view = 'DATE';
		this.scope.$emit('calender:close');
	}

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
				setViewMode(scope.mode)

				scope.okLabel = picker.okLabel;
				scope.cancelLabel = picker.cancelLabel;

				scope.currentDate = isNaN(ngModelCtrl.$viewValue) ? moment(): ngModelCtrl.$viewValue ;

				scope.$mdMedia =$mdMedia;
				function setViewMode(mode){
					switch(mode) {
						case 'date-time':
						scope.view = 'DATE'
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
						setViewMode(scope.mode)
						scope.$emit('calender:close');

					}
				})

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
					setViewMode(scope.mode)
					scope.$emit('calender:close');
				}


				scope.closeDateTime = function(){
					scope.$emit('calender:close');
				}

			}
		}
	}

	var app = angular.module('smDateTimeRangePicker');
	app.directive('smDatePicker', ['$timeout', 'picker', '$mdMedia', '$window', DatePickerDir]);
	app.directive('smTimePicker', ['$timeout', 'picker', '$mdMedia', '$window', TimePickerDir]);
})();
