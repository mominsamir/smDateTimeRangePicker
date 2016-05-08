(function(){
  'use strict';

  angular.module('demoApp')
    .run(['$templateCache', function ($templateCache) {
      $templateCache.put('partials/menu-link.tmpl.html',
        '<md-button  \n' +
        ' ng-click="focusSection(section)">\n' +
        '  <md-icon ng-if="section.icon" md-font-icon="material-icons">{{section.icon}}</md-icon>' +
        '  {{section | humanizeDoc}}\n' +
        '</md-button>');
    }])
    .directive('menuLink', function () {
      return {
        scope: {
          section: '='
        },
        templateUrl: 'partials/menu-link.tmpl.html',
        link: function ($scope, $element) {

          var controller = $element.parent().controller();

          $scope.focusSection = function (section) {
            // set flag to be used later when
            // $locationChangeSuccess calls openPage()
            controller.autoFocusContent = true;
            controller.goToState(section.state);

          };
        }
      };
    })
})();