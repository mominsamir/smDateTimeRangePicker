
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
	      	startDay:"@"
	    },
	    templateUrl:"date-picker.html",
		link : function(scope,element,att,ngModelCtrl){
			setViewMode(scope.mode)

			scope.currentDate = isNaN(ngModelCtrl.$viewValue)  ? moment().format(scope.format): ngModelCtrl.$modelValue ;

			ngModelCtrl.$viewChangeListeners.push(function() {
				scope.currentDate = ngModelCtrl.$modelValue;
			});

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

			scope.selectedDateTime = function(){
				var date = moment(scope.selectedDate,"MM-DD-YYYY");
				if(!date.isValid()){
					date = moment();
				}
				if(!angular.isUndefined(scope.selectedTime)){	
					var timeSplit = scope.selectedTime.split(':');
					date.hour(timeSplit[0]).minute(timeSplit[1]);
				}
				ngModelCtrl.$setViewValue(date.format(scope.format));
				ngModelCtrl.$render();
				setViewMode(scope.mode)
				scope.$emit('calender:close');			
			}

			scope.closeDateTime = function(){
				scope.$emit('calender:close');			
			}

			scope.$on('$destroy',function(){
			   element.remove();
			});
		}      
	}
}


var app = angular.module('dateTimePicker');

app.directive('smDatePicker',['$timeout',DatePickerDir]);


})();


