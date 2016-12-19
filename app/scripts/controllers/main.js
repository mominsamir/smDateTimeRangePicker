/* global moment */
'use strict';

function MainCtrl($scope, $timeout, $mdSidenav, $mdUtil, $log, $state, $mdDialog, smDateTimePicker) {
    var vm = this;
    vm.minDate = moment().add(10, 'd').format('MM-DD-YYYY');
    vm.maxDate = moment().add(1, 'M').format('MM-DD-YYYY');
    vm.dateOfBirth = moment();
    vm.dateOfPay2 = {
        stratDate: new Date(),
        endDate: new Date()
    };

    vm.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    vm.overrideList = [{
        position:1,
        label:'Custom',
        startDate: moment(),
        endDate: moment()
    }]

    vm.clearInput = function() {
        vm.dateOfBirth = '';
    }

    vm.dateSelected = function(date){
        vm.callBackValue = date;
    }

    vm.changeModelValue = function(){
        vm.dateOfBirth = '10-10-2016 10:10';
    }

    vm.currentDate = '10-15-2015';
    var options = {
        mode : 'date',
        view : 'DATE',
        format : 'MM-DD-YYYY',
        minDate : '03-10-2016',
        maxDate : null,
        weekStartDay :'Sunday',
        closeOnSelect : true
    }

    vm.currentDate1 = moment();
    var options1 = {
        mode: 'date-time',
        format: 'MM-DD-YYYY HH:mm',
        minDate: '03-10-2016',
        maxDate: null,
        weekStartDay:'Sunday'
    }

    vm.showCalander = function(ev){
        options.targetEvent = ev;
        smDateTimePicker(vm.currentDate, options)
        .then(function(selectedDate) {
            vm.currentDate = selectedDate;
        });
    }

    vm.showCalander1 = function(ev){
        options1.targetEvent = ev;
        smDateTimePicker(vm.currentDate1, options1).then(function(selectedDate) {
            vm.currentDate1 = selectedDate;
            var ele = document.getElementsByClassName('md-scroll-mask');
            if (ele.length !== 0) {
                angular.element(ele).remove();
            }
        });
    }

    vm.showDailog = function(ev){
        $mdDialog.show({
            templateUrl: 'views/dailog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: false
        });
    }

    vm.dayofPaySelected = function(range) {
        vm.rangeObj = range;
    }

    vm.dayofPay2Selected = function(range) {
        vm.rangeObj2 = range;
    }

    function buildToggler(navID) {
        var debounceFn = $mdUtil.debounce(function(){
            $mdSidenav(navID)
            .toggle().then(function () {
                $log.debug('toggle ' + navID + ' is done');
            });
        }, 300);
        return debounceFn;
    }
    vm.toggleLeft = buildToggler('left');

    vm.save = function(form){
        validateForm(form);
    }

    function validateForm(form){
        angular.forEach(form, function(obj, name){
            if (name.indexOf('$') !== 0) {
                obj.$validate();
                obj.$touched= true;
            }
        });
        form.$setSubmitted();
        return form.$valid;
    }
}

function LeftCtrl($timeout, $mdSidenav, $mdUtil, $log) {
    var vm = this;
    vm.close = function () {
        $mdSidenav('left').close()
        .then(function () {
        });
    };
}

angular.module('demoApp')
    .controller('MainCtrl', ['$scope', '$timeout', '$mdSidenav', '$mdUtil', '$log', '$state', '$mdDialog', 'smDateTimePicker', MainCtrl])
    .controller('LeftCtrl', ['$timeout', '$mdSidenav', '$mdUtil', '$log', LeftCtrl]);
