

(function(){
  angular.module('demoApp')
    .run(['$templateCache', function($templateCache){
      $templateCache.put('partials/menu-toggle.tmpl.html',
        '<a href\n' +
        '  ng-click="toggle()"\n' +
        '  aria-controls="side-menu-{{section.name | nospace}}"\n' +
        '  aria-expanded="{{isOpen()}}">\n' +
        '  <md-icon class="menu-icon" md-font-icon="material-icons">{{section.iconp}}</md-icon> ' +
        ' <div class="menu-text-container">\n ' +
        '      <span class="menu-text">{{section.name}}</span>\n' +
        '      <md-icon aria-hidden="true" class="menu-toggle-icon" ng-class="{\'toggled\' : isOpen()}">keyboard_arrow_right</md-icon>\n' +
        ' </div>\n' +
        '</a>\n' +
        '<ul ng-show="isOpen()" id="side-menu-{{section.name | nospace}}" class="menu-toggle-list">\n' +
        '  <li ng-repeat="page in section.pages">\n' +
        '    <menu-link section="page"></menu-link>\n' +
        '  </li>\n' +
        '</ul>\n' +
        '');
    }])
    .directive('menuToggle', [ '$timeout', function($timeout) {
      return {
        scope: {
          section: '='
        },
        templateUrl: 'partials/menu-toggle.tmpl.html',
        link: function($scope, $element) {
          
          var controller = $element.parent().controller();

          $scope.isOpen = function() {
            return controller.isOpen($scope.section);
          };
          $scope.toggle = function() {
            controller.toggleOpen($scope.section);
          };
        }
      };
    }])

})();


/*(function(){
  angular.module('demoApp')
    .run(['$templateCache', function($templateCache){
      $templateCache.put('partials/menu-toggle.tmpl.html',
        '<a class="md-button-toggle"\n' +
        '  ng-click="toggle()"\n' +
        '  aria-controls="side-menu-{{section.name | nospace}}"\n' +
        '  flex layout="row"\n' +
        '  aria-expanded="{{isOpen()}}">\n' +
        '  <md-icon md-font-icon="material-icons">{{section.iconp}}</md-icon> {{section.name}}\n' +
        '  <span aria-hidden="true" class="pull-right material-icons md-toggle-icon"\n' +
        '  ng-class="{\'toggled\' : isOpen()}">keyboard_arrow_down</span>\n' +
        '</a>\n' +
        '<ul ng-show="isOpen()" id="side-menu-{{section.name | nospace}}" class="menu-toggle-list">\n' +
        '  <li ng-repeat="page in section.pages">\n' +
        '    <menu-link section="page"></menu-link>\n' +
        '  </li>\n' +
        '</ul>\n' +
        '');
    }])
    .directive('menuToggle', [ '$timeout', function($timeout) {
      return {
        scope: {
          section: '='
        },
        templateUrl: 'partials/menu-toggle.tmpl.html',
        link: function($scope, $element) {
          var controller = $element.parent().controller();

          $scope.isOpen = function() {
            return controller.isOpen($scope.section);
          };
          $scope.toggle = function() {
            controller.toggleOpen($scope.section);
          };
        }
      };
    }])

})();*/