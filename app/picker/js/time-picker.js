
(function(){

'use strict';

function TimePickerDir($timeout){
  return {
    restrict : 'E',
      replace:true,
      scope :{
          initialDate : "@",
          minDate:"=",
          maxDate:"=",
          format:"@",
          mode:"@",         
          startDay:"@",
          closeOnSelect:"@"
      },
      template: '<div class="sm-clock">'+
                '     <div class="sm-clock-container" >'+
                '         <md-button class="md-button md-icon-button hour-number hour-number{{$index}}"'+
                '           ng-repeat="h in numbers" '+
                '           ng-class="{\'md-primary\': h.isCurrent,\'md-primary md-raised\': selectedHour===h.h || selectedMinute===h.h} "'+
                '           ng-click="selectTime($event,$index,h.h)">'+
                '           {{h.h}}'+
                '         </md-button>'+
                '     <md-toolbar class="sm-clock-center md-primary"></md-toolbar>'+
                '     <md-toolbar class="sm-clock-hand md-primary"></md-toolbar>'+
                '     </div>'+
                '</div>',
    link : function(scope,element,att,ngModelCtrl){
        var currentTime = moment();
        
        scope.selectedHour = currentTime.hour();
        scope.hourNumber =[];       //hour setting
        scope.minuteNumber  =[];    //minute setting
        scope.view ='HOUR';         //start at hour View


        var buildHours = function(){
          for (var i = 1; i <= 12; i++) {

              var obj = {
                h : i,
                isCurrent : ((moment().hour()>12 ? moment().hour()-12:moment().hour()) === i),
                m : moment()                
              }
              scope.hourNumber.push(obj);
          };
        }
        var buildMinutes = function(){
          for (var i = 0; i < 60;) {
              var obj = {
                h : i,
                isCurrent : (moment().minute() === i),
                m : moment()
              }
              scope.minuteNumber.push(obj);
               i=i+5;
          }
        }

        buildHours();
        buildMinutes();



        var hand = angular.element(document.querySelector('.sm-clock-hand'));
        

        scope.numbers = scope.hourNumber;

        scope.selectTime= function($event,index,h){
          if(scope.view==='HOUR'){
              scope.selectedHour = h;
              clearHandSelection();
              hand.addClass('sm-clock-hand-'+index);
              scope.swichTo('MINUTE');
          }else{
              scope.selectedMinute = h;
              clearHandSelection();
              hand.addClass('sm-clock-hand-'+index);
              scope.swichTo('HOUR');
          }
          console.log(scope.selectedHour,scope.selectedMinute);
        }

        function clearHandSelection(){
            for (var i = 0; i <= 12;i++) {
              var cls = 'sm-clock-hand-'+i;
              hand.removeClass(cls);
            };
        }

        scope.resetToDefaultClockHand = function(){
            hand.addClass('sm-clock-hand-'+11);
        }

        scope.swichTo = function(view){
            switch (view){
              case 'HOUR':
                $timeout(function() {
                  scope.numbers = scope.hourNumber;
                  scope.view ='HOUR';
                }, 1000);
                break;
              case 'MINUTE':
                $timeout(function() {
                  scope.numbers = scope.minuteNumber;
                  scope.view ='MINUTE';                
                }, 10);
                break;
              default:
                break;
            }
        }



    }      
  }
}


var app = angular.module('smDateTimeRangePicker');

app.directive('smTimePickerU',['$timeout',TimePickerDir]);


})();


