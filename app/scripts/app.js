'use strict';

angular
  .module('demoApp', [
    'ngAnimate',
    'ui.router',
    'ngMessages',
    'ngMaterial',
    'smDateTimeRangePicker'
  ])
  .run(function($http,$templateCache) {
      $http.get("views/massages.html")
      .then(function(response) {
        $templateCache.put('error-messages', response.data); 
      })
     }) 
.config(function ($stateProvider, $urlRouterProvider,$mdThemingProvider,pickerProvider) {

    pickerProvider.setDayHeader('single');

    pickerProvider.setOkLabel('Save');
    
    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
            url: '/home',  
            templateUrl: 'views/home.html',
            controller: 'MainCtrl',
            controllerAs : 'vm',
            data: {
                title: 'Dashboard',
            }            
    }).state('date-time-picker', {
            url: '/date-time-picker-demo',  
            templateUrl: 'views/date-time-picker-demo.html',
            controller: 'MainCtrl',
            controllerAs : 'vm',
            data: {
                title: 'Date Time Picker Demo',
            }            
    }).state('date-time-picker-api', {
            url: '/date-time-picker-api',  
            templateUrl: 'views/date-time-picker-api.html',
            controller: 'MainCtrl',
            controllerAs : 'vm',
            data: {
                title: 'Date Time Picker API',
            }            
    }).state('range-picker-demo', {
            url: '/range-picker-demo',  
            templateUrl: 'views/range-picker-demo.html',
            controller: 'MainCtrl',
            controllerAs : 'vm',
            data: {
                title: 'Range Picker Demo',
            }            
    }).state('range-picker-api', {
            url: '/range-picker-api',  
            templateUrl: 'views/range-picker-api.html',
            controller: 'MainCtrl',
            controllerAs : 'vm',
            data: {
                title: 'Range Picker API',
            }            
    }).state('timepicker', {
            url: '/timepicker',  
            templateUrl: 'views/timepicker.html',
            controller: 'MainCtrl',
            controllerAs : 'vm',
            data: {
                title: 'Range Picker API',
            }            
    }).state('time-picker-demo', {
            url: '/time-picker-demo',  
            templateUrl: 'views/time-picker-demo.html',
            controller: 'MainCtrl',
            controllerAs : 'vm',
            data: {
                title: 'Range Picker API',
            }            
    }).state('time-picker-api', {
            url: '/time-picker-api',  
            templateUrl: 'views/time-picker-api.html',
            controller: 'MainCtrl',
            controllerAs : 'vm',
            data: {
                title: 'Range Picker API',
            }            
    });
   



    $mdThemingProvider.theme('default')
        .primaryPalette('green');
  });
    