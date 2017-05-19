(function(){
  'use strict';

      function MenuCtrl ($log, $state, $timeout, $location,$mdSidenav, menu) {

        var vm = this;

        //functions for menu-link and menu-toggle
        vm.isOpen = isOpen;
        vm.toggleOpen = toggleOpen;
        vm.isSectionSelected = isSectionSelected;
        vm.autoFocusContent = false;
        vm.goToState = goToState;
        vm.menu = menu;


        vm.status = {
          isFirstOpen: true,
          isFirstDisabled: false
        };


       function isOpen(section) {
          return menu.isSectionSelected(section);
        }

        function toggleOpen(section) {
          menu.toggleSelectSection(section);
        }

        function isSectionSelected(section) {
          var selected = false;
          var openedSection = menu.openedSection;
          if(openedSection === section){
            selected = true;
          }
          else if(section.children) {
            section.children.forEach(function(childSection) {
              if(childSection === openedSection){
                selected = true;
              }
            });
          }
          return selected;
        }

        function goToState(state){
            $state.go(state);

            $mdSidenav('left').close()
              .then(function () {
                $log.debug('close RIGHT is done ssss');
            });

        };            

      }

  angular.module('demoApp')
    .controller('MenuCtrl', ['$log','$state','$timeout','$location','$mdSidenav','menu', MenuCtrl]);

})();