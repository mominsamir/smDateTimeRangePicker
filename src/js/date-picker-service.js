(function(){

'use strict';

var app = angular.module('smDateTimeRangePicker');


function DatePickerServiceCtrl( $mdDialog, $mdMedia, $timeout){
    var self = this;
    self.currentDate = self.initialDate;
    self.view = 'DATE';
    self.$mdMedia = $mdMedia;

    if(!angular.isUndefined(self.options) && (angular.isObject(self.options))){
        self.mode = isExist(self.options.mode,self.mode); 
        self.format = isExist(self.options.format,self.format);
        self.minDate = isExist(self.options.minDate,undefined);
        self.maxDate = isExist(self.options.maxDate,undefined);
        self.weekStartDay = isExist(self.options.weekStartDay,'Sunday');
        self.closeOnSelect =isExist(self.options.closeOnSelect,false);
    }

    setViewMode(self.mode);

    function isExist(val,def){
        return angular.isUndefined(val)? def:val;
    }


    function setViewMode(mode){
        switch(mode) {
            case 'date':
                self.headerDispalyFormat = "ddd, MMM DD ";                     
            break;
            case 'date-time':
                self.headerDispalyFormat = "ddd, MMM DD HH:mm";            
            break;
            case 'time':
                self.headerDispalyFormat = "HH:mm";
            break;
            default:
                self.headerDispalyFormat = "ddd, MMM DD ";
        }                   
    }

    self.closeDateTime = function(){
        $mdDialog.cancel();
    }
    self.selectedDateTime = function(){
        if(angular.isUndefined(self.selectedDate)){
         self.selectedDate= self.currentDate;   
        }
        $mdDialog.hide(self.selectedDate.format(self.format));
    }
}


app.provider("$smDateTimePicker", function() {
    
    this.$get = ["$mdDialog", function($mdDialog) {

        var datePicker = function(initialDate, options) {


            if (!angular.isUndefined(initialDate)) initialDate = moment();
            if (!angular.isObject(options)) options = {};
            
            return $mdDialog.show({
                controller:  ['$mdDialog', '$mdMedia', '$timeout', DatePickerServiceCtrl],
                controllerAs: 'vm',
                bindToController: true,
                clickOutsideToClose: true,
                targetEvent: options.targetEvent,
                templateUrl: "picker/date-picker-service.html",
                locals: {
                    initialDate: initialDate,
                    options: options
                }
            });
        };
    
        return datePicker;
    }];
});


})();


;







