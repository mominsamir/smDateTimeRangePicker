'use strict';

     function MainCtrl($timeout, $mdSidenav, $mdUtil, $log,$state,$mdDialog,smDateTimePicker) {
        var vm = this;
        vm.minDate = moment().subtract(1,'M').format('MM-DD-YYYY');
        vm.maxDate = moment().add(1,'M').format('MM-DD-YYYY');

        console.log(vm.minDate);
        vm.hours = [1,2,3,4,5,6,7,8,9,10,11,12];

        vm.currentDate = moment();  
        var options = {
          mode : 'date-time',
          view : 'DATE',
          format : 'MM-DD-YYYY',
          minDate : '03-10-2016',
          maxDate : null,    
          weekStartDay :'Sunday',
          closeOnSelect : true
        }

        vm.currentDate1 = moment();  
        var options1 = {
          mode : 'date-time',
          view : 'DATE',
          format : 'MM-DD-YYYY',
          minDate : '03-10-2016',
          maxDate : null,    
          weekStartDay :'Sunday'
        }        

        vm.showCalander = function(ev){
          options.targetEvent = ev;
          smDateTimePicker(vm.currentDate,options).then(function(selectedDate) {
            vm.currentDate = selectedDate;
            var ele = document.getElementsByClassName("md-scroll-mask");
            if(ele.length!==0){ 
                angular.element(ele).remove();
            }            
          });          
        }



        vm.showCalander1 = function(ev){
          options1.targetEvent = ev;
          smDateTimePicker(vm.currentDate1,options1).then(function(selectedDate) {
            vm.currentDate1 = selectedDate;
            var ele = document.getElementsByClassName("md-scroll-mask");
            if(ele.length!==0){ 
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

        vm.logout = function(ev){
          var confirm = $mdDialog.confirm()
                .title('Logout')
                .content('Save all your work before logout')
                .ariaLabel('Logout')
                .targetEvent(ev)
                .ok('Logout')
                .fullscreen(true)
                .cancel('Cancel');
          $mdDialog.show(confirm).then(function() {
             Auth.logout(); 
          }, function() {
            
          });          
        };
        

        function buildToggler(navID) {
          var debounceFn =  $mdUtil.debounce(function(){
                $mdSidenav(navID)
                  .toggle().then(function () {
                    $log.debug('toggle ' + navID + ' is done');
                  });
              },300);
          return debounceFn;
        }
        vm.toggleLeft = buildToggler('left');
        
    }

      function LeftCtrl($timeout, $mdSidenav, $mdUtil, $log){
        var vm = this;
            vm.close = function () {
            $mdSidenav('left').close()
              .then(function () {
              });
          };
      }




angular.module('demoApp')
.controller('MainCtrl',['$timeout', '$mdSidenav', '$mdUtil', '$log','$state', '$mdDialog','smDateTimePicker',MainCtrl])
.controller('LeftCtrl', ['$timeout', '$mdSidenav', '$mdUtil', '$log',LeftCtrl]);
