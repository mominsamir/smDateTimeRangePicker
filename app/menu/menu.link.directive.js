(function(){
  'use strict';

  angular.module('demoApp')
    .run(['$templateCache', function ($templateCache) {
      $templateCache.put('partials/menu-link.tmpl.html',
        '<md-button class="md-button" href  \n' +
        ' ng-click="focusSection(section)">\n' +
        '  <i ng-if="section.icon" class="menu-icon material-icons">' +
        '     {{section.icon}}</i>\n' +
        '    <div class="menu-text-container">\n' +
        '       <span class="menu-text">{{section | humanizeDoc}}</span>\n' +
        '    </div>\n' +
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
