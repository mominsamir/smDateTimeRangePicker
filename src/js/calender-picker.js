
(function(){

'use strict';

function DatePickerDir(){
	return {
	  restrict : 'E',
      require: '^ngModel',
      replace:true,
      scope :{
	      	initialDate : "@",
	      	minDate:"=",
	      	maxDate:"=",
	      	format:"@",
	      	mode:"@",	      	
	      	startDay:"@",
	      	closeOnSelect:"@"
	    },
	    templateUrl:"date-picker.html",
		link : function(scope,element,att,ngModelCtrl){
			setViewMode(scope.mode)

			scope.currentDate = isNaN(ngModelCtrl.$viewValue)  ? moment(): ngModelCtrl.$viewValue ;

			function setViewMode(mode){
				switch(mode) {
				    case 'date-time':
						scope.view = 'DATE'
						scope.headerDispalyFormat = "ddd, MMM DD HH:mm";			
				        break;
				    case 'time':
				        scope.view = 'HOUR';
						scope.headerDispalyFormat = "HH:mm";
				        break;
				    default:
				        scope.view = 'DATE';
				}					
			}

			scope.$on('calender:date-selected',function(){
				if(scope.closeOnSelect && (scope.mode!=='date-time' || scope.mode!=='time')){
					var date = moment(scope.selectedDate,scope.format);
					if(!date.isValid()){
						date = moment();
						scope.selectedDate =date;
					}
					if(!angular.isUndefined(scope.selectedTime)){	
						var timeSplit = scope.selectedTime.split(':');
						date.hour(timeSplit[0]).minute(timeSplit[1]);
					}
					scope.currentDate =scope.selectedDate;
					ngModelCtrl.$setViewValue(date.format(scope.format));
					ngModelCtrl.$render();
					setViewMode(scope.mode)
					scope.$emit('calender:close');			

				}
			})

			scope.selectedDateTime = function(){
				var date = moment(scope.selectedDate,scope.format);
				if(!date.isValid()){
					date = moment();
					scope.selectedDate =date;
				}
				if(!angular.isUndefined(scope.selectedTime)){	
					var timeSplit = scope.selectedTime.split(':');
					date.hour(timeSplit[0]).minute(timeSplit[1]);
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

app.directive('smDatePicker',['$timeout',DatePickerDir]);


})();


