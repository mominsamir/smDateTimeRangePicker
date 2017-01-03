/* global moment */
function smRangePicker (picker){
    return{
        restrict : 'E',
        require : ['^?ngModel', 'smRangePicker'],
        scope:{
            format:'@',
            divider: '@',
            weekStartDay :'@',
            customToHome: '@',
            closeOnSelect: '@',
            mode: '@',
            showCustom:'@',
            customList: '=',
            minDate : '@',
            maxDate : '@',
            allowClear: '@',
            allowEmpty: '@',
            rangeSelectCall : '&'
        },
        terminal:true,
        controller: ['$scope', 'picker', RangePickerCtrl],
        controllerAs : 'vm',
        bindToController:true,
        templateUrl : 'picker/range-picker.html',
        link : function(scope, element, att, ctrls){
            var ngModelCtrl = ctrls[0];
            var calCtrl = ctrls[1];
            calCtrl.configureNgModel(ngModelCtrl);
        }
    }
}

var RangePickerCtrl = function($scope, picker){
    var self = this;
    self.scope = $scope;
    self.clickedButton = 0;
    self.startShowCustomSettting =self.showCustom;


    self.startDate = moment();
    self.endDate = moment();

    self.divider = angular.isUndefined(self.scope.divider) || self.scope.divider ===''? picker.rangeDivider : $scope.divider;

    //display the clear button?
    self.showClearButton = self.allowClear === 'true' || false;
    //allow set start/end date as empty value
    self.allowEmptyDates = self.allowEmpty === 'true' || false;

    self.okLabel = picker.okLabel;
    self.cancelLabel = picker.cancelLabel;
    self.clearLabel = picker.clearLabel;
    self.view = 'DATE';

    self.rangeCustomStartEnd = picker.rangeCustomStartEnd;
    var defaultList = [];
    angular.copy(picker.rangeDefaultList, defaultList);
    self.rangeDefaultList = defaultList;
    if(self.customList){
        for (var i = 0; i < self.customList.length; i++) {
            self.rangeDefaultList[self.customList[i].position] = self.customList[i];
        }
    }

    if(self.showCustom){
        self.selectedTabIndex=0;
    }else{
        self.selectedTabIndex = $scope.selectedTabIndex;
    }

}

RangePickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
    this.ngModelCtrl = ngModelCtrl;
    var self = this;
    ngModelCtrl.$render = function() {
        self.ngModelCtrl.$viewValue= self.startDate+' '+ self.divider +' '+self.endDate;
    };
};

RangePickerCtrl.prototype.setNextView = function(){
    switch (this.mode){
        case 'date':
        this.view = 'DATE';
        if(this.selectedTabIndex ===0 ){
            this.selectedTabIndex =1
        }
        break;
        case 'date-time':
        if(this.view === 'DATE'){
            this.view = 'TIME';
        }else{
            this.view = 'DATE';
            if(this.selectedTabIndex ===0 ){
                this.selectedTabIndex =1
            }
        }
        break;
        default:
        this.view = 'DATE';
        if(this.selectedTabIndex ===0 ){
            this.selectedTabIndex =1
        }
    }
}

RangePickerCtrl.prototype.showCustomView = function(){
    this.showCustom=true;
    this.selectedTabIndex=0

}

RangePickerCtrl.prototype.dateRangeSelected = function(){
    var self = this;
    self.selectedTabIndex =0;
    self.view= 'DATE';
    if(self.startShowCustomSettting){
        self.showCustom=true;
    }else{
        self.showCustom=false;
    }
    self.setNgModelValue(self.startDate, self.divider, self.endDate);
}

/* sets an empty value on dates. */
RangePickerCtrl.prototype.clearDateRange = function(){
    var self = this;
    self.selectedTabIndex =0;
    self.view= 'DATE';
    if(self.startShowCustomSettting){
        self.showCustom=true;
    }else{
        self.showCustom=false;
    }
    self.setNgModelValue('', self.divider, '');
}


RangePickerCtrl.prototype.startDateSelected = function(date){
    this.startDate = date;
    this.minStartToDate = date;
    this.scope.$emit('range-picker:startDateSelected');
    this.setNextView();

    if (this.endDate && this.endDate.diff(this.startDay, 'ms') < 0) {
        this.endDate = date;
    }
}

RangePickerCtrl.prototype.startTimeSelected = function(time){

    this.startDate.hour(time.hour()).minute(time.minute());
    this.minStartToDate = angular.copy(this.startDate);
    this.scope.$emit('range-picker:startTimeSelected');
    this.setNextView();
}


RangePickerCtrl.prototype.endDateSelected = function(date){
    this.endDate = date;
    this.scope.$emit('range-picker:endDateSelected');
    if(this.closeOnSelect && this.mode==='date'){
        this.setNgModelValue(this.startDate, this.divider, this.endDate);
    }else{
        this.setNextView();
    }
}

RangePickerCtrl.prototype.endTimeSelected = function(time){
    this.endDate.hour(time.hour()).minute(time.minute());
    this.scope.$emit('range-picker:endTimeSelected');
    if(this.closeOnSelect && this.mode==='date-time'){
        this.setNgModelValue(this.startDate, this.divider, this.endDate);
    }
}



RangePickerCtrl.prototype.setNgModelValue = function(startDate, divider, endDate) {
    var self = this;
    var momentStartDate = startDate || null;
    var momentEndDate = endDate || null;


    if(startDate)
    {
        startDate = startDate.format(self.format) || '';
    }

    if(endDate)
    {
        endDate = endDate.format(self.format) || '';
    }

  var range = {startDate: startDate, endDate: endDate, startDateAsMoment: momentStartDate, endDateAsMoment: momentEndDate};

    //var range = {startDate: startDate, endDate: endDate};
    self.rangeSelectCall({range: range});
    var _ng_model_value;

    //if no startDate && endDate, then empty the model.
    if(!startDate && !endDate)
    {
        _ng_model_value = '';
    }else
    {
        startDate = startDate || 'Any';
        endDate = endDate || 'Any';
        _ng_model_value = startDate + ' ' + divider + ' ' + endDate;
    }

    setTimeout(function()
    {
        self.ngModelCtrl.$setViewValue(_ng_model_value);
        self.ngModelCtrl.$render();
    }, 50);
    self.selectedTabIndex = 0;
    self.view ='DATE';
    self.scope.$emit('range-picker:close');
};


RangePickerCtrl.prototype.cancel = function() {
    var self = this;
    if(self.customToHome && self.showCustom) {
        self.showCustom=false;
    }else{
        self.selectedTabIndex =0;
        self.showCustom=false;
        self.scope.$emit('range-picker:close');
    }
}

var app = angular.module('smDateTimeRangePicker');
app.directive('smRangePicker', ['picker', smRangePicker]);
