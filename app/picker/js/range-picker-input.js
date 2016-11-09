(function(){

'use strict';

function RangePickerInput($document,$mdMedia,$mdUtil,picker){
    return {
      restrict : 'EA',
      replace: true,
      require: ['^ngModel'],
      scope :{
        label : "@",
        fname : "@",
        isRequired : '@',
        closeOnSelect: '@',
        disable : '=',
        format : '@',
        mode : '@',
        divider: '@',
        showCustom:'@',
        weekStartDay :"@",
        customToHome: "@",
        customList: '=',
        noFloatingLabel:"=", 
        minDate : '@',
        maxDate : '@',
        allowClear : '@',
        allowEmpty : '@',
        onRangeSelect : '&'
      },
      controller: ['$scope', '$element', '$mdUtil', '$mdMedia', '$document', SMRangePickerCtrl],
      controllerAs: 'vm',
      bindToController:true,
      template: function (element,attributes){
        return ' <md-input-container md-no-float="vm.noFloatingLabel">'
                +'      <input name="{{vm.fname}}" ng-model="vm.value" ng-readonly="true"'
                +'             type="text" '
                +'             aria-label="{{vm.fname}}" ng-required="{{vm.isRequired}}" class="sm-input-container"'
                +'             ng-focus="vm.show()" placeholder="{{vm.label}}">'
                +'   <div id="picker" class="sm-calender-pane md-whiteframe-4dp" ng-model="value">'                
                +'    <sm-range-picker ng-model="vm.value" custom-to-home="{{vm.customToHome}}" custom-list="vm.customList" mode="{{vm.mode}}" min-date="{{vm.minDate}}"  max-date="{{vm.maxDate}}" range-select-call="vm.rangeSelected(range)" close-on-select="{{vm.closeOnSelect}}" show-custom="{{vm.showCustom}}" week-start-day="{{vm.weekStartDay}}"  divider="{{vm.divider}}" format="{{vm.format}}" allow-clear="{{vm.allowClear}}" allow-empty="{{vm.allowEmpty}}"></sm-range-picker>'
                +'   </div> '  
                +'  </md-input-container>';
      },
      link :  function(scope,$element,attr,ctrl){

            ctrl[0].$render = function() {
                scope.vm.value = this.$viewValue;
            }

/*        var inputPane = $element[0].querySelector('.sm-input-container');
        var calenderPane = $element[0].querySelector('.sm-calender-pane');
        var cElement = angular.element(calenderPane);
        scope.format = angular.isUndefined(scope.format) ? 'MM-DD-YYYY': scope.format;
        
        cElement.addClass('hide hide-animate');

        scope.startDate  = angular.isUndefined(scope.value)? scope.startDate : scope.value;

        $document.on('click', function (e) {
            if ((calenderPane !== e.target && inputPane !==e.target) && (!calenderPane.contains(e.target) && !inputPane.contains(e.target))) {
              hideElement();
            }
        });
        angular.element(inputPane).on('keydown', function (e) {
            if(e.which===9){
              hideElement();
            }
        });

      scope.rangeSelected = function(range){
          scope.onRangeSelect({range:range});
        }


        scope.show= function(){
          var elementRect = inputPane.getBoundingClientRect();
          var bodyRect = document.body.getBoundingClientRect();
           cElement.removeClass('hide');
          if($mdMedia('sm') ||  $mdMedia('xs')){
            calenderPane.style.left = (bodyRect.width-296)/2+'px';
            calenderPane.style.top =  (bodyRect.height-450)/2+ 'px';
          }else{
            var rect = getVisibleViewPort(elementRect,bodyRect);
            calenderPane.style.left = (rect.left) + 'px';
            calenderPane.style.top = (rect.top) + 'px';
          }

          document.body.appendChild(calenderPane);
          $mdUtil.disableScrollAround(calenderPane);
          cElement.addClass('show');

        }

        // calculate visible port to display calender
        function getVisibleViewPort(elementRect,bodyRect){
          var calenderHeight = 460;
          var calenderWidth = 296;

          var top =elementRect.top;
          if(elementRect.top +calenderHeight > bodyRect.bottom){
            top = elementRect.top - ((elementRect.top +calenderHeight) - (bodyRect.bottom -20));
          }
          var left = elementRect.left;
          if(elementRect.left +calenderWidth > bodyRect.right){
             left = elementRect.left - ((elementRect.left +calenderWidth) - (bodyRect.right -10));
          }
          return {top : top, left : left };
        }



        scope.$on('range-picker:close',function(){
          hideElement();
        });

        scope.$on('$destroy',function(){
          calenderPane.parentNode.removeChild(calenderPane);
        });

        function hideElement(){
            cElement.addClass('hide-animate');
            cElement.removeClass('show');          
            $mdUtil.enableScrolling();                                    
        }

        function destroyCalender(){
          calenderPane.parentNode.removeChild(calenderPane);
        }
*/

    }
  }
} 


var SMRangePickerCtrl = function($scope, $element, $mdUtil, $mdMedia, $document) {
    var self = this;
    self.$scope = $scope;
    self.$element = $element;    
    self.$mdUtil = $mdUtil;
    self.$mdMedia = $mdMedia;
    self.$document = $document;
    self.isCalenderOpen = false;


    self.calenderHeight = 460;
    self.calenderWidth = 296;


    //find input button and assign to variable
    self.inputPane = $element[0].querySelector('.sm-input-container');
    
    //find Calender Picker  and assign to variable    
    self.calenderPane = $element[0].querySelector('.sm-calender-pane');
    //button to start calender        
    self.button = $element[0].querySelector('.sm-picker-icon');

    self.calenderPan = angular.element(self.calenderPane);

    //check if mode is undefied set to date mode 
    self.mode = angular.isUndefined($scope.mode) ? 'date' : $scope.mode;
    // check if Pre defined format is supplied
    self.format = angular.isUndefined($scope.format) ? 'MM-DD-YYYY' : $scope.format;

    self.calenderPan.addClass('hide hide-animate');

    self.bodyClickHandler = angular.bind(self,self.clickOutSideHandler);

    self.$scope.$on('range-picker:close', function() {
      self.$document.off('keydown');
      self.hideElement();
    });

    self.$scope.$on('$destroy', function() {
      self.calenderPane.parentNode.removeChild(self.calenderPane);
    }); 

    // if tab out hide key board
    angular.element(self.inputPane).on('keydown', function(e) {
      switch(e.which){
        case  27:
        case  9:
          self.hideElement();
            break;
        }
    });

}


/*get visiable port

  @param : elementnRect 

  @param : bodyRect 

*/

SMRangePickerCtrl.prototype.getVisibleViewPort = function(elementRect, bodyRect) {
    var self = this;

    var top = elementRect.top;
    if (elementRect.top + self.calenderHeight > bodyRect.bottom) {
        top = elementRect.top - ((elementRect.top + self.calenderHeight) - (bodyRect.bottom - 20));
    }
    var left = elementRect.left;
    if (elementRect.left + self.calenderWidth > bodyRect.right) {
        left = elementRect.left - ((elementRect.left + self.calenderWidth) - (bodyRect.right - 10));
    }
    return {
        top: top,
        left: left
    };
}

SMRangePickerCtrl.prototype.rangeSelected = function(range){
  var self = this;
  console.log(range);
  self.onRangeSelect({range: range});
  self.value = range;
}


SMRangePickerCtrl.prototype.show = function($event) {
  var self = this;
  var elementRect = self.inputPane.getBoundingClientRect();
  var bodyRect = document.body.getBoundingClientRect();

  self.calenderPan.removeClass('hide hide-animate');
  
  if (self.$mdMedia('sm') || self.$mdMedia('xs')) {
    self.calenderPane.style.left = (bodyRect.width - 320) / 2 + 'px';
    self.calenderPane.style.top = (bodyRect.height - 450) / 2 + 'px';
  } else {
    var rect = self.getVisibleViewPort(elementRect, bodyRect);
    self.calenderPane.style.left = (rect.left) + 'px';
    self.calenderPane.style.top = (rect.top) + 'px';
  }

  
  document.body.appendChild(self.calenderPane);
  angular.element(self.calenderPane).focus();

  
  self.calenderPan.addClass('show');
  self.$mdUtil.disableScrollAround(self.calenderPane);    
  
  
  self.isCalenderOpen =true;
  self.$document.on('click',self.bodyClickHandler);
}


SMRangePickerCtrl.prototype.tabOutEvent= function(element){
  var self = this;
    if (element.which === 9) {
      self.hideElement();
    }
}

SMRangePickerCtrl.prototype.hideElement= function() {
  var self = this;
  self.calenderPan.addClass('hide-animate');
  self.calenderPan.removeClass('show');
  self.$mdUtil.enableScrolling();

  if(self.button){
    angular.element(self.button).focus();    
  }
  self.$document.off('click'); 
  self.isCalenderOpen =false;

}


SMRangePickerCtrl.prototype.clickOutSideHandler = function(e){
  var self = this;
  if(!self.button){
    if ((self.calenderPane !== e.target && self.inputPane !== e.target ) && (!self.calenderPane.contains(e.target)  && !self.inputPane.contains(e.target))) {
      self.hideElement();
    }
  }else{
    if ((self.calenderPane !== e.target && self.button !== e.target ) && (!self.calenderPane.contains(e.target)  && !self.button.contains(e.target))) {
      self.hideElement();
    }
  }
}

var app = angular.module('smDateTimeRangePicker');
app.directive('smRangePickerInput',['$document','$mdMedia','$mdUtil','picker',RangePickerInput]);

})();