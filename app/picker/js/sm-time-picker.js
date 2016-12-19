/* global moment */
function smTimePickerNew($mdUtil, $mdMedia, $document, $timeout, picker){
    return {
        restrict : 'E',
        replace:true,
        scope :{
            value: '=',
            startDate : '@',
            weekStartDay : '@',
            startView:'@',
            mode : '@',
            format : '@',
            minDate : '@',
            maxDate : '@',
            fname : '@',
            lable : '@',
            isRequired : '@',
            disable : '=',
            form : '=',
            closeOnSelect:'@'
        },
        templateUrl: 'picker/sm-time-picker.html',
        link :  function(scope, $element, attr){
            var inputPane = $element[0].querySelector('.sm-input-container');
            var calenderPane = $element[0].querySelector('.sm-calender-pane');
            var cElement = angular.element(calenderPane);
            scope.ngMassagedTempaltePath =picker.massagePath;
            // check if Pre defined format is supplied
            scope.format = angular.isUndefined(scope.format) ? 'MM-DD-YYYY': scope.format;


            // Hide calender pane on initialization
            cElement.addClass('hide hide-animate');

            // set start date
            scope.startDate = angular.isUndefined(scope.value)? scope.startDate : scope.value;

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
                if($mdMedia('sm') || $mdMedia('xs')){
                    calenderPane.style.left = (bodyRect.width-300)/2+'px';
                    calenderPane.style.top = (bodyRect.height-450)/2+ 'px';
                }else{
                    var rect = getVisibleViewPort(elementRect, bodyRect);
                    calenderPane.style.left = (rect.left) + 'px';
                    calenderPane.style.top = (rect.top) + 'px';
                }
                document.body.appendChild(calenderPane);
                $mdUtil.disableScrollAround(calenderPane);
                cElement.addClass('show');
            }

            // calculate visible port to display calender
            function getVisibleViewPort(elementRect, bodyRect){
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

            function hideElement(){
                cElement.addClass('hide-animate');
                cElement.removeClass('show');
                //this is only for animation
                //calenderPane.parentNode.removeChild(calenderPane);
                $mdUtil.enableScrolling();
            }

            scope.$on('$destroy', function(){
                calenderPane.parentNode.removeChild(calenderPane);
            });

            //listen to emit for closing calender
            scope.$on('calender:close', function(){
                hideElement();
            });
        }
    }
}

var app = angular.module('smDateTimeRangePicker');
app.directive('smTimePickerNew', ['$mdUtil', '$mdMedia', '$document', '$timeout', 'picker', smTimePickerNew]);
