(function(){

    'use strict';

    function RangePickerInput($document,$mdMedia,$mdUtil,picker){
        return {
            restrict : 'EA',
            replace: true,
            require: ['^ngModel'],
            scope: {
                label: '@',
                fname: '@',
                isRequired: '@',
                closeOnSelect: '@',
                disable: '=',
                format: '@',
                mode: '@',
                divider: '@',
                showCustom: '@',
                value: '=ngModel',
                weekStartDay: '@',
                customToHome: '@',
                customList: '=',
                noFloatingLabel: '=',
                minDate: '@',
                maxDate: '@',
                allowClear: '@',
                allowEmpty: '@',
                onRangeSelect: '&'
            },
            controller: ['$scope', '$element', '$mdUtil', '$mdMedia', '$document', SMRangePickerCtrl],
            controllerAs: 'vm',
            bindToController:true,
            templateUrl: 'picker/range-picker-input.html',
            link: function(scope, $element, attr, ctrl){

                scope._watch_model = scope.$watch('vm.value', function(newVal, oldVal)
                    {
                        if(newVal && (newVal !== oldVal || !scope.vm.valueAsText))
                        {
                            if(typeof newVal === 'object')
                            {
                                if(newVal.__$toString)
                                {
                                    scope.vm.valueAsText = newVal.__$toString;
                                    delete newVal.__$toString;
                                }else
                                {
                                    var _temp = [];
                                    if(newVal.startDate)
                                    {
                                        _temp.push(moment.utc(newVal.startDate).format(scope.vm.format || 'YYYY-MM-DD'));
                                    }else
                                    {
                                        _temp.push('Any');
                                    }
                                    _temp.push(scope.vm.divider);
                                    if(newVal.endDate)
                                    {
                                        _temp.push(moment.utc(newVal.endDate).format(scope.vm.format || 'YYYY-MM-DD'));
                                    }else
                                    {
                                        _temp.push('Any');
                                    }

                                    scope.vm.valueAsText = _temp.join(' ');
                                }
                            }else //it must be removed in future releases once the input cannot be a string anymore.
                            {
                                scope.vm.valueAsText = scope.vm.value || '';
                            }
                        }
                    });

                //
            }
        };
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

        self.bodyClickHandler = angular.bind(self, self.clickOutSideHandler);

        self.$scope.$on('range-picker:close', function() {
            self.$document.off('keydown');
            self.hideElement();
        });

        self.$scope.$on('$destroy', function() {
            self.calenderPane.parentNode.removeChild(self.calenderPane);
            self.$scope._watch_model();
        });

        // if tab out hide key board
        angular.element(self.inputPane).on('keydown', function(e) {
            switch(e.which){
                case 27:
                case 9:
                self.hideElement();
                break;
            }
        });
    };


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
    };

    SMRangePickerCtrl.prototype.rangeSelected = function(range){
        var self = this;
        self.onRangeSelect({range: range});
        self.value = {startDate: range.startDateAsMoment, endDate: range.endDateAsMoment, __$toString: range.text};
    };


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
        self.$document.on('click', self.bodyClickHandler);
    };


    SMRangePickerCtrl.prototype.tabOutEvent= function(element){
        var self = this;
        if (element.which === 9) {
            self.hideElement();
        }
    };

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
    };


    SMRangePickerCtrl.prototype.clickOutSideHandler = function(e){
        var self = this;
        if(e.target && e.target.nodeName === 'BODY')
        {
            return;
        }

        if(!self.button){
            if (( self.calenderPane !== e.target && self.inputPane !== e.target ) &&
                (!self.calenderPane.contains(e.target) && !self.inputPane.contains(e.target) ) )
            {
                //(!self.calenderPane.contains(e.target) && !self.inputPane.contains(e.target))) {
                self.$scope.$broadcast('range-picker-input:blur');
                self.hideElement();
            }
        }else{
            if ((self.calenderPane !== e.target && self.button !== e.target ) &&
                (!self.calenderPane.contains(e.target) && !self.button.contains(e.target))) {
                self.hideElement();
            }
        }
    };

    var app = angular.module('smDateTimeRangePicker');
    app.directive('smRangePickerInput', ['$document', '$mdMedia', '$mdUtil', 'picker', RangePickerInput]);
})();
