'use strict';

     function MainCtrl($timeout, $mdSidenav, $mdUtil, $log,$state) {
        var vm = this;
        vm.minDate = moment().subtract(1,'M').format('MM-DD-YYYY');
        vm.maxDate = moment().add(1,'M').format('MM-DD-YYYY');

        vm.hours = [1,2,3,4,5,6,7,8,9,10,11,12];

        vm.currentDate = moment();  


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




angular.module('demo')
.controller('MainCtrl',['$timeout', '$mdSidenav', '$mdUtil', '$log','$state',MainCtrl])
.controller('LeftCtrl', ['$timeout', '$mdSidenav', '$mdUtil', '$log',LeftCtrl]);
