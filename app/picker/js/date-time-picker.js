/* global moment */
function DateTimePicker($mdUtil, $mdMedia, $document, picker) {
    return {
        restrict: 'E',
        require: ['^ngModel', 'smDateTimePicker'],
        scope: {
            weekStartDay: '@',
            startView: '@',
            mode: '@',
            format: '@',
            minDate: '@',
            maxDate: '@',
            fname: '@',
            label: '@',
            isRequired: '@',
            disable: '=',
            noFloatingLabel: '=',
            disableYearSelection: '@',
            closeOnSelect: '@',
            onDateSelectedCall: '&'
        },
        controller: ['$scope', '$element', '$mdUtil', '$mdMedia', '$document', SMDateTimePickerCtrl],
        controllerAs: 'vm',
        bindToController:true,
        template: function (element, attributes){
            var inputType = '';
            if(attributes.hasOwnProperty('onFocus')) {
                inputType = '<input name="{{vm.fname}}" ng-model="vm.value" '
                + '  type="text" placeholder="{{vm.label}}"'
                + '  aria-label="{{vm.fname}}" ng-focus="vm.show()" data-ng-required="vm.isRequired"  ng-disabled="vm.disable"'
                + '  server-error class="sm-input-container" />' ;
            } else {
                inputType = '      <input class="" name="{{vm.fname}}" ng-model="vm.value" '
                + '             type="text" placeholder="{{vm.label}}" '
                + '             aria-label="{{vm.fname}}" aria-hidden="true" data-ng-required="vm.isRequired"  ng-disabled="vm.disable"/>'
                + '     <md-button tabindex="-1" class="sm-picker-icon md-icon-button" aria-label="showCalender" ng-disabled="vm.disable" aria-hidden="true" type="button" ng-click="vm.show()">'
                + '         <svg  fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
                + '     </md-button>' ;
            }

            return '<md-input-container class="sm-input-container md-icon-float md-block" md-no-float="vm.noFloatingLabel">' +
            inputType +
            '     <div id="picker" class="sm-calender-pane md-whiteframe-z2">' +
            '          <sm-date-picker ' +
            '              id="{{vm.fname}}Picker" ' +
            '              initial-date="vm.initialDate"' +
            '              ng-model="vm.value"' +
            '              mode="{{vm.mode}}" ' +
            '              disable-year-selection={{vm.disableYearSelection}}' +
            '              close-on-select="{{vm.closeOnSelect}}"' +
            '              start-view="{{vm.startView}}" ' +
            '              data-min-date="vm.minDate" ' +
            '              data-max-date="vm.maxDate"  ' +
            '              data-format="{{vm.format}}"  ' +
            '              data-on-select-call="vm.onDateSelected(date)"' +
            '              data-week-start-day="{{vm.weekStartDay}}" > ' +
            '         </sm-date-picker>' +
            '     </div>' +
            ' </md-input-container>';
        },
        link: function(scope, $element, attr, ctrl) {
            var ngModelCtrl = ctrl[0];
            var pickerCtrl = ctrl[1];
            pickerCtrl.configureNgModel(ngModelCtrl);
        }
    }
}
var SMDateTimePickerCtrl = function($scope, $element, $mdUtil, $mdMedia, $document) {
    var self = this;
    self.$scope = $scope;
    self.$element = $element;
    self.$mdUtil = $mdUtil;
    self.$mdMedia = $mdMedia;
    self.$document = $document;
    self.isCalenderOpen = false;
    self.disablePicker = $scope.disable;

    self.calenderHeight = 320;
    self.calenderWidth = 450;


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

    self.$scope.$on('calender:close', function() {
        self.$document.off('keydown');
        self.hideElement();
    });

    self.$scope.$on('$destroy', function() {
        self.calenderPane.parentNode.removeChild(self.calenderPane);
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

}


SMDateTimePickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
    var self = this;
    self.ngModelCtrl = ngModelCtrl;

    self.ngModelCtrl.$formatters.push(function(dateValue) {

        if(!dateValue && angular.isUndefined(dateValue)) {
            self.value='';
            self.onDateSelectedCall({date: null});
            return
        }
        if (!dateValue ){
            self.value='';
            return;
        }
        self.setNgModelValue(dateValue);
    });

};

SMDateTimePickerCtrl.prototype.setNgModelValue = function(date) {
    var self = this;
    self.onDateSelectedCall({date: date});
    var d = {};
    if (moment.isMoment(date)){
        d = date.format(self.format);
    } else {
        d = moment(date, self.format).format(self.format);
    }
    self.ngModelCtrl.$setViewValue(d);
    self.ngModelCtrl.$render();
    self.value = d;
};

SMDateTimePickerCtrl.prototype.onDateSelected = function(date){
    var self = this;
    self.setNgModelValue(date);
}



/*get visiable port

@param : elementnRect

@param : bodyRect

*/

SMDateTimePickerCtrl.prototype.getVisibleViewPort = function(elementRect, bodyRect) {
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



SMDateTimePickerCtrl.prototype.show = function($event) {
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


SMDateTimePickerCtrl.prototype.tabOutEvent= function(element){
    var self = this;
    if (element.which === 9) {
        self.hideElement();
    }
}

SMDateTimePickerCtrl.prototype.hideElement= function() {
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


SMDateTimePickerCtrl.prototype.clickOutSideHandler = function(e){
    var self = this;
    if(!self.button){
        if ((self.calenderPane !== e.target && self.inputPane !== e.target ) && (!self.calenderPane.contains(e.target) && !self.inputPane.contains(e.target))) {
            self.hideElement();
        }
    } else {
        if ((self.calenderPane !== e.target && self.button !== e.target ) && (!self.calenderPane.contains(e.target) && !self.button.contains(e.target))) {
            self.hideElement();
        }
    }
}


var app = angular.module('smDateTimeRangePicker');
app.directive('smDateTimePicker', ['$mdUtil', '$mdMedia', '$document', 'picker', DateTimePicker]);
