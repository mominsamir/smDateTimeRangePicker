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
