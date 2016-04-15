'use strict';

     function MainCtrl($timeout, $mdSidenav, $mdUtil, $log,$state,smDateTimePicker) {
        var vm = this;
        vm.minDate = moment().subtract(1,'M').format('MM-DD-YYYY');
        vm.maxDate = moment().add(1,'M').format('MM-DD-YYYY');

        console.log(vm.minDate);
        vm.hours = [1,2,3,4,5,6,7,8,9,10,11,12];

        vm.currentDate = moment();  
        var o = {
          mode : 'date-time',
          view : 'DATE',
          format : 'MM-DD-YYYY',
          minDate : '03-10-2016',
          maxDate : null,    
          weekStartDay :'Sunday',
          closeOnSelect : false
        }

        vm.showCalander = function(ev){
          o.targetEvent = ev;
          smDateTimePicker(vm.currentDate,o).then(function(selectedDate) {
            vm.currentDate = selectedDate;
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
.controller('MainCtrl',['$timeout', '$mdSidenav', '$mdUtil', '$log','$state','smDateTimePicker',MainCtrl])
.controller('LeftCtrl', ['$timeout', '$mdSidenav', '$mdUtil', '$log',LeftCtrl]);
