function DateTimePicker($mdUtil,$mdMedia,$document,picker){
    return {
      restrict : 'E',
      require: ['^ngModel'],
      replace:true,
      scope :{
        weekStartDay : '@',
        startView:"@",                  
        mode : '@',
        format : '@',
        minDate : '@',
        maxDate : '@',
        fname : "@",
        lable : "@",
        isRequired : '@',
        disable : '=',
        noFloatingLabel:"=",
        disableYearSelection : '@',
	      closeOnSelect:"@",
        onDateSelectedCall :"&"
      },
      template: '  <md-input-container md-no-float="noFloatingLabel">'
                +'    <input name="{{fname}}" data-ng-model="value" '
                +'             type="text" placeholder="{{lable}}"'
                +'             aria-label="{{fname}}" ng-focus="show()" data-ng-required="isRequired"  ng-disabled="disable"'
                +'              server-error class="sm-input-container" >'
                +'    	<div id="picker" class="sm-calender-pane md-whiteframe-4dp">'
                +'     		 <sm-date-picker '
                +'              id="{{fname}}Picker" '  
                +'				      initial-date="value"'
                +'              mode="{{mode}}" '
                +'              disable-year-selection={{disableYearSelection}}'
                +'				      close-on-select="{{closeOnSelect}}"'
                +'              start-view="{{startView}}" '  
                +'              data-min-date="minDate" '
                +'              data-max-date="maxDate"  '
                +'              data-format="{{format}}"  '
                +'              data-on-select-call="onDateSelected(date)"'
                +'          	data-week-start-day="{{weekStartDay}}" > '
                +'			   </sm-date-picker>'
                +'    	</div>'                
                +'    </input>'                
                +'  </md-input-container>',
      link :  function(scope,$element,attr,ctrl){
        var inputPane = $element[0].querySelector('.sm-input-container');
        var calenderPane = $element[0].querySelector('.sm-calender-pane');
        var cElement = angular.element(calenderPane);

        //check if mode is undefied set to date mode 
        scope.mode = angular.isUndefined(scope.mode) ? 'date':scope.mode;
        // check if Pre defined format is supplied
        scope.format = angular.isUndefined(scope.format) ? 'MM-DD-YYYY': scope.format;
        
        // Hide calender pane on initialization
        cElement.addClass('hide hide-animate');

        // set start date
        ctrl[0].$render = function(){
          scope.value= scope.startDate  =  this.$viewValue;
        }

        scope.onDateSelected = function(date){
            scope.onDateSelectedCall({date:date});
            scope.value = date.format(scope.format);
        }

        // Hide Calender on click out side
        $document.on('click', function (e) {
            if ((calenderPane !== e.target && inputPane !==e.target) && (!calenderPane.contains(e.target) && !inputPane.contains(e.target))) {
        		hideElement();
            }
        });

        // if tab out hide key board
        angular.element(inputPane).on('keydown', function (e) {
            if(e.which===9){
        		hideElement();
            }
        });

        // show calender 
        scope.show= function(){
          var elementRect = inputPane.getBoundingClientRect();
          var bodyRect = document.body.getBoundingClientRect();

          cElement.removeClass('hide');
          if($mdMedia('sm') ||  $mdMedia('xs')){
            calenderPane.style.left = (bodyRect.width-320)/2+'px';
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
          var calenderHeight = 320;
          var calenderWidth = 450;

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

        function hideElement(){
           cElement.addClass('hide-animate');
        	 cElement.removeClass('show');
           $mdUtil.enableScrolling();
        }

        scope.$on('$destroy',function(){
          calenderPane.parentNode.removeChild(calenderPane);
        });
                
        //listen to emit for closing calender
        scope.$on('calender:close',function(){
        	hideElement();
        });
    }
  }
}


var app = angular.module('smDateTimeRangePicker');
app.directive('smDateTimePicker',['$mdUtil','$mdMedia','$document','picker',DateTimePicker]);
