'use strict';


angular
  .module('dateTimePicker', [
    'ngAnimate',
    'ngMaterial'
  ])
  .config(function ($mdThemingProvider,pickerProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue');
  });
    