function DateTimePicker($mdUtil,$mdMedia,$document,picker){
    return {
      restrict : 'E',
      replace:true,
      scope :{
        value: '=',
        startDate : '@',
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
        form : '=',
        disableYearSelection : '@',
	      closeOnSelect:"@"
      },
      template: '  <md-input-container md-no-float>'
                +'    <label for="{{fname}}" >{{lable }}</label>'
                +'    <input name="{{fname}}" ng-model="value" '
                +'             type="text" placeholde="{{lable}}"'
                +'             aria-label="{{fname}}" ng-focus="show()" data-ng-required="isRequired" ng-disabled="disable"'
                +'              server-error class="sm-input-container">'
                +'    <div ng-messages="form[fname].$error" ng-if="form[fname].$touched">'
                +'    		<div ng-messages-include="{{ngMassagedTempaltePath}}"></div>'
                +'    </div>'
                +'    	<div id="picker" class="sm-calender-pane md-whiteframe-15dp">'
                +'     		<sm-date-picker '
                +'              id="{{fname}}Picker" '  
                +'              ng-model="value" '
                +'				      initial-date="value"'
                +'              mode="{{mode}}" '
                +'              disable-year-selection={{disableYearSelection}}'
                +'				      close-on-select="{{closeOnSelect}}"'
                +'              start-view="{{startView}}" '  
                +'              data-min-date="minDate" '
                +'              data-max-date="maxDate"  '
                +'              data-format="{{format}}"  '
                +'          	data-week-start-day="{{weekStartDay}}" > '
                +'			</sm-date-picker>'
                +'    	</div>'                
                +'  </md-input-container>',
      link :  function(scope,$element,attr){

        var inputPane = $element[0].querySelector('.sm-input-container');
        var calenderPane = $element[0].querySelector('.sm-calender-pane');
        var cElement = angular.element(calenderPane);

        scope.noFloat = 'noFloat' in attr;

        scope.ngMassagedTempaltePath =picker.massagePath;
        // check if Pre defined format is supplied
        scope.format = angular.isUndefined(scope.format) ? 'MM-DD-YYYY': scope.format;
        
        // Hide calender pane on initialization
        cElement.addClass('hide hide-animate');

        // set start date
        scope.startDate  = angular.isUndefined(scope.value)? scope.startDate : scope.value;

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
        //listen to emit for closing calender
        scope.$on('calender:close',function(){
        	hideElement();
        });
    }
  }
}


var app = angular.module('smDateTimeRangePicker');
app.directive('smDateTimePicker',['$mdUtil','$mdMedia','$document','picker',DateTimePicker]);
