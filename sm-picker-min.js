'use strict';

function run($templateCache){
    var datepickerhtml = '<div class="picker-container  md-whiteframe-15dp">'+
	'	<md-content  class="container" >'+
	'		<md-toolbar class="md-height">			'+
	'			<div class="md-toolbar-tools">'+
	'				<div layout="column" flex="100" class="">'+
	'					<span flex ng-hide="mode===\'time\'" class="md-subhead">{{currentDate.format(\'YYYY\')}}</span>'+
	'					<div class="date-time-header">'+
	'							{{currentDate.format(\'ddd, MMM DD\')}}			'+
	'						</span>'+
	'						<span  class="time-display" ng-show="mode===\'date-time\' || mode===\'time\'">'+
	'							{{currentDate.format(\'HH:mm\')}}			'+
	'						</span>'+
	'					</div>					'+
	'				</div>'+
	'			</div>	'+
	'		</md-toolbar>'+
	'		<div ng-show="view===\'DATE\'" >'+
	'			<sm-calender '+
	'				ng-model="selectedDate"'+
	'				id="{{fname}}Picker" '+
	'				data-mode="{{mode}}" '+
	'				data-min-date="minDate" '+
	'				data-max-date="maxDate" '+
	'				close-on-select="{{closeOnSelect}}"				 '+
	'				data-format="{{format}}"  '+
	'				data-start-day="{{weekStartDay}}">'+
	'			</sm-calender>'+
	'		</div>'+
	'		<div ng-show="view===\'HOUR\'">'+
	'			<sm-time'+
	'				ng-model="selectedTime"'+
	'				data-format="HH:mm">'+
	'			</sm-time>'+
	'		</div>		'+
	'		<div class="action" layout="row" layout-align="end center" ng-hide="closeOnSelect && (mode!==\'date-time\' || mode!==\'time\')">'+
	'				<div ng-show="mode===\'date-time\'">'+
	'					<md-button class="md-icon-button" ng-show="view===\'DATE\'" ng-click="view=\'HOUR\'">'+
	'						<md-icon md-font-icon="material-icons md-primary">access_time</md-icon>'+
	'					</md-button>				'+
	'					<md-button class="md-icon-button" ng-show="view===\'HOUR\'" ng-click="view=\'DATE\'">'+
	'						<md-icon md-font-icon="material-icons md-primary">date_range</md-icon>'+
	'					</md-button>'+
	'				</div>												'+
	'				<span flex></span>'+
	'				<md-button class="md-button md-primary" ng-click="closeDateTime()">{{cancelLabel}}</md-button>'+
	'				<md-button class="md-button md-primary" ng-click="selectedDateTime()">{{okLabel}}</md-button>'+
	'		</div>'+
	'	</md-content>	'+
	'</div>';

    var calenderdatehtml = '<div  class="date-picker">'+
'			<div ng-if="vm.view===\'YEAR_MONTH\'" ng-class="{\'year-container\' : vm.view===\'YEAR_MONTH\'}"> '+
'				<md-virtual-repeat-container id="year-container" class="year-md-repeat" md-top-index="vm.yearTopIndex">'+
'				      <div md-virtual-repeat="yr in vm.yearItems"  md-on-demand  class="repeated-item" flex>'+
'						<md-button class="md-button" '+
'							ng-click="vm.changeYear(yr)" 							'+
'							ng-class="{\'md-primary\': yr === vm.currentDate.year(),'+
'										\'md-primary md-raised\' :yr ===vvm.currentDate.year(),'+
'										\'selected-year md-primary\':vm.initialDate.year()===yr}">'+
'							{{yr}}'+
'						</md-button>				          '+
'				      </div>'+
'				</md-virtual-repeat-container>		     '+
'			</div>				'+
'			<div ng-show="vm.view===\'DATE\'" ng-class="{\'date-container\' : vm.view===\'DATE\'}">'+
'				<div layout="row" class="navigation" layout-align="space-between center">'+
'						<md-button '+
'							ng-disabled="vm.stopScrollPrevious" '+
'							class="md-icon-button scroll-button" '+
'							aria-label="privious" '+
'							ng-click="vm.changePeriod(\'p\')">'+
'								<md-icon md-font-icon="material-icons">keyboard_arrow_left</md-icon>					'+
'						</md-button>'+
'						<md-button class="md-button" ng-class="vm.moveCalenderAnimation" ng-click="vm.changeView(\'YEAR_MONTH\');vm.showYear()">'+
'							{{vm.monthList[vm.initialDate.month()]}}{{\' \'}}{{vm.initialDate.year()}}'+
'						</md-button>			'+
'						<md-button  '+
'							ng-disabled="vm.stopScrollNext" '+
'							class="md-icon-button scroll-button" '+
'							aria-label="next" '+
'							ng-click="vm.changePeriod(\'n\')">'+
'							<md-icon md-font-icon="material-icons">keyboard_arrow_right</md-icon>	'+
'						</md-button>				'+
'				</div>			'+
'				<div layout="row" class="date-cell-header">'+
'					<md-button class="md-icon-button" ng-disabled="true" ng-repeat="dHead in vm.dateCellHeader">'+
'						{{dHead[vm.dayHeader]}}'+
'					</md-button>'+
'				</div>		'+
'				<div '+
'					md-swipe-right="vm.changePeriod(\'p\')" '+
'					class="date-cell-row" '+
'					md-swipe-left="vm.changePeriod(\'n\')" '+
'					ng-class="vm.moveCalenderAnimation">'+
'					<div layout="row" ng-repeat="w in vm.dateCells" >'+
'						<md-button'+
'							ng-repeat="d in w"'+
'							class="md-icon-button"'+
'							ng-click="vm.selectDate(d.date,d.isDisabledDate)"'+
'							ng-disabled="d.isDisabledDate"'+
'							ng-class="{\'md-primary\' : d.today,'+
'								\'active\':d.isCurrentMonth,'+
'								\'md-primary md-raised selected\' :d.date.isSame(vm.currentDate),'+
'								\'disabled\':d.isDisabledDate}">'+
'							<span>{{d.dayNum}}</span>'+
'						</md-button>'+
'					</div>'+
'				</div>'+
'			</div>'+
'</div>';

    var calenderhourhtml = '<div  class="hour-picker" >'+
'	<div class="hour-container">'+
'		<div layout="row" class="hour-header">'+
'				<span flex="50">Hour</span>'+
'				<span flex="50">Minute</span>'+
'		</div>'+
'		<div ng-if="vm.show">'+
'			<md-virtual-repeat-container id="hour-container" class="hour-md-repeat" >'+
'				<div md-virtual-repeat="h in vm.hourCells"  class="repeated-item" >'+
'						<md-button class="md-icon-button" '+
'							ng-click="vm.setHour(h.hour)" 							'+
'							ng-class="{\'md-primary\': h.isCurrent,'+
'									\'md-primary md-raised\' :h.hour===vm.currentDate.hour()}">'+
'							{{h.hour}}'+
'						</md-button>'+
'				</div>'+
'			</md-virtual-repeat-container>		     '+
'		</div>'+
'		<div ng-if="vm.show">'+
'			<md-virtual-repeat-container id="minute-container" class="minute-md-repeat" >'+
'				<div md-virtual-repeat="m in vm.minuteCells"  class="repeated-item" >'+
'						<md-button class="md-icon-button" '+
'							ng-click="vm.setMinute(m.minute)" 							'+
'							ng-class="{\'md-primary\': m.isCurrent,'+
'								\'md-primary md-raised\' :m.minute===vm.currentDate.minute()}">'+
'							{{m.minute}}'+
'						</md-button>'+
'				</div>'+
'			</md-virtual-repeat-container>		     '+
'		</div>	'+
'	</div>'+
'</div>';

    var rangepickerhtml = '<div layout="column"  id="{{id}}" class="range-picker md-whiteframe-2dp" >'+
'    <md-toolbar layout="row"  class="md-primary" >'+
'      	<div class="md-toolbar-tools"  layout-align="center center">'+
'			<div flex class="date-display"><span>{{vm.startDate.format(vm.format)}}</span></div>'+
'			<div flex class="date-display"><span>{{vm.endDate.format(vm.format)}}</span></div>'+
'		</div>'+
'	</md-toolbar>'+
'	<div  layout="column" class="pre-select"  role="button" ng-show="!vm.showCustom">'+
'				<md-button  ng-class="{\'md-primary\': vm.clickedButton===1}" ng-click="vm.preDefineDate(1)">{{vm.rangeDefaultList[0]}}</md-button>'+
'		<md-button ng-class="{\'md-primary\': vm.clickedButton===2}" ng-click="vm.preDefineDate(2)">{{vm.rangeDefaultList[1]}}</md-button>		'+
'		<md-button ng-class="{\'md-primary\': vm.clickedButton===3}"  ng-click="vm.preDefineDate(3)">{{vm.rangeDefaultList[2]}}</md-button>'+
'		<md-button ng-class="{\'md-primary\': vm.clickedButton===4}"  ng-click="vm.preDefineDate(4)">{{vm.rangeDefaultList[3]}}</md-button>'+
'		<md-button ng-class="{\'md-primary\': vm.clickedButton===5}"  ng-click="vm.preDefineDate(5)">{{vm.rangeDefaultList[4]}}</md-button>	'+
'		<md-button ng-class="{\'md-primary\': vm.clickedButton===8}" ng-click="vm.preDefineDate(8)">{{vm.rangeDefaultList[5]}}</md-button>		'+
'		<md-button ng-class="{\'md-primary\': vm.clickedButton===6}"  ng-click="vm.preDefineDate(6)">{{vm.rangeDefaultList[6]}}</md-button>	'+
'		<md-button ng-class="{\'md-primary\': vm.clickedButton===7}"  ng-click="vm.preDefineDate(7)">{{vm.rangeDefaultList[7]}}</md-button>'+
'	</div>'+
'	<div layout="column" layout-sm="column" class="custom-select" flex ng-show="vm.showCustom" ng-class="{\'show-calender\': vm.showCustom}">'+
'		<div layout="row"   class="tab-head">'+
'			<span layout="column" class="md-ink-ripple" ng-class="{\'active moveLeft\':vm.selectedTabIndex===0}">{{vm.rangeCustomStartEnd[0]}}</span>'+
'			<span layout="column" class="md-ink-ripple" ng-class="{\'active moveLeft\':vm.selectedTabIndex===1}">{{vm.rangeCustomStartEnd[1]}}</span>			'+
'		</div>'+
'		<div ng-show="vm.selectedTabIndex===0" ng-model="vm.startDate" >'+
'			<sm-calender '+
'				week-start-day="Sunday">'+
'			</sm-calender>'+
'		</div>'+
'		<div ng-if="vm.selectedTabIndex===1" ng-model="vm.endDate" >'+
'			<sm-calender '+
'				initial-date="{{vm.startDate.format(format)}}"'+
'				min-date="vm.startDate"'+
'				week-start-day="Sunday">'+
'			</sm-calender>'+
'		</div>								'+
'	</div>'+
'	<md-divider></md-divider>'+
'	<div layout="row" layout-align="end center">'+
'		<md-button type="button" class="md-primary" ng-click="vm.cancel()">{{vm.cancelLabel}}</md-button>						'+
'		<md-button type="button" class="md-primary" ng-click="vm.dateRangeSelected()">{{vm.okLabel}}</md-button>	'+
'	</div>	'+
'</div>';

    var timePicker = '<div class="picker-container  md-whiteframe-15dp">'+
'	<md-content  class="container" >'+
'		<md-toolbar class="md-height">			'+
'			<div class="md-toolbar-tools">'+
'				<div layout="column" flex="100" class="">'+
'					<span flex ng-hide="mode===\'time\'" class="md-subhead">{{currentDate.format(\'YYYY\')}}</span>'+
'					<div class="date-time-header">'+
'						<span flex class="date-display" ng-hide="mode===\'time\'">'+
'							{{currentDate.format(\'ddd, MMM DD\')}}			'+
'						</span>'+
'						<span  class="time-display" ng-show="mode===\'date-time\' || mode===\'time\'">'+
'							{{currentDate.format(\'HH:mm\')}}			'+
'						</span>'+
'					</div>					'+
'				</div>'+
'			</div>	'+
'		</md-toolbar>'+
'		<div >'+
'			<sm-time'+
'				ng-model="selectedTime"'+
'				data-format="HH:mm">'+
'			</sm-time>'+
'		</div>		'+
'		<div class="action" layout="row" layout-align="end center" ng-hide="closeOnSelect && (mode!==\'date-time\' || mode!==\'time\')">'+
'				<div ng-show="mode===\'date-time\'">'+
'					<md-button class="md-icon-button" ng-show="view===\'DATE\'" ng-click="view=\'HOUR\'">'+
'						<md-icon md-font-icon="material-icons md-primary">access_time</md-icon>'+
'					</md-button>				'+
'					<md-button class="md-icon-button" ng-show="view===\'HOUR\'" ng-click="view=\'DATE\'">'+
'						<md-icon md-font-icon="material-icons md-primary">date_range</md-icon>'+
'					</md-button>'+
'				</div>												'+
'				<span flex></span>'+
'				<md-button class="md-button md-primary" ng-click="closeDateTime()">{{cancleLabel}}</md-button>'+
'				<md-button class="md-button md-primary" ng-click="selectedDateTime()">{{okLabel}}</md-button>'+
'		</div>'+
'	</md-content>	'+
'</div>';

	$templateCache.put('calender-date.html',calenderdatehtml);			
	$templateCache.put('calender-hour.html',calenderhourhtml);			
	$templateCache.put('date-picker.html',datepickerhtml);					
	$templateCache.put('range-picker.html',rangepickerhtml);	
	$templateCache.put('time-picker.html',timePicker);	
			

}


angular
  .module('smDateTimeRangePicker', [
    'ngAnimate',
    'ngMaterial'
  ])
  .run(['$templateCache',run]);
    
(function(){

'use strict';

function Calender($timeout,picker){
	return {
	  restrict : 'E',
	  replace:true,
      require: ['^ngModel', 'smCalender'],
      scope :{
	      	initialDate : "@",
	      	minDate:"=",
	      	maxDate:"=",
	      	format:"@",
	      	mode:"@",
	      	startView:"@",	      	
	      	startDay:"@"
	    },
	   	controller:["$scope","$timeout","picker",CalenderCtrl],
	    controllerAs : 'vm',
	    templateUrl:"calender-date.html",
		link : function(scope,element,att,ctrls){
			var ngModelCtrl = ctrls[0];
	        var calCtrl = ctrls[1];
	        calCtrl.configureNgModel(ngModelCtrl);

			scope.$on('$destroy',function(){
			   element.remove();
			});
		}      
	}
}

var CalenderCtrl = function($scope,$timeout,picker){
	var self  = this;

	self.$scope = $scope;
	self.$timeout = $timeout;
    self.picker = picker;
    self.dayHeader = self.picker.dayHeader;
	self.initialDate = $scope.initialDate; 	//if calender to be  initiated with specific date 
	self.startDay = angular.isUndefined($scope.startDay) || $scope.startDay==='' ? 'Sunday' : $scope.startDay ;	   	//if calender to be start on specific day default is sunday
	self.minDate = $scope.minDate;			//Minimum date 
	self.maxDate = $scope.maxDate;			//Maximum date 
	self.mode = angular.isUndefined($scope.mode) ? 'DATE' : $scope.mode;
	self.format = $scope.format;
	self.restrictToMinDate = angular.isUndefined($scope.minDate) ? false : true;
	self.restrictToMaxDate = angular.isUndefined($scope.maxDate) ? false : true;
	self.stopScrollPrevious =false;
	self.stopScrollNext = false;
	self.monthCells=[];
	self.dateCellHeader= [];	
	self.dateCells = [];
	self.monthList = picker.monthNames;
	self.moveCalenderAnimation='';
	self.format = angular.isUndefined(self.format) ? 'MM-DD-YYYY': self.format;
	self.initialDate =	angular.isUndefined(self.initialDate)? moment() : moment(self.initialDate,self.format);
	self.currentDate = self.initialDate.clone();
	if(self.restrictToMinDate) 
		self.minDate = moment(self.minDate, self.format);
	if(self.restrictToMaxDate) 
		self.maxDate = moment(self.maxDate, self.format);
    self.yearItems = {
        currentIndex_: 0,
        PAGE_SIZE: 7,
        START: 1900,
        getItemAtIndex: function(index) {
            if(this.currentIndex_ < index)
                this.currentIndex_ = index;
            return this.START + index;
        },
        getLength: function() {
            return this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2);
        }
    };	
	self.init();
}


CalenderCtrl.prototype.configureNgModel = function(ngModelCtrl) {
    this.ngModelCtrl = ngModelCtrl;
    var self = this;
    ngModelCtrl.$render = function() {
      self.ngModelCtrl.$viewValue= self.currentDate;
    };
  };


  CalenderCtrl.prototype.setNgModelValue = function(date) {
  	var self = this;
    self.ngModelCtrl.$setViewValue(date);
    self.ngModelCtrl.$render();
  };

CalenderCtrl.prototype.init = function(){
	var self = this;
/*	self.buildYearCells();*/
	self.buildDateCells();
	self.buildDateCellHeader();
	self.buildMonthCells();
	self.setView()

};

CalenderCtrl.prototype.setView = function(){
	var self = this;
	self.headerDispalyFormat = "ddd, MMM DD";	
	switch(self.mode) {
	    case 'date-time':
			self.view = 'DATE'
			self.headerDispalyFormat = "ddd, MMM DD HH:mm";			
	        break;
	    case 'time':
	        self.view = 'HOUR';
			self.headerDispalyFormat = "HH:mm";
	        break;
	    default:
	        self.view = 'DATE';
	}	
}

CalenderCtrl.prototype.showYear = function() { 
	var self = this;
    self.yearTopIndex = (self.initialDate.year() - self.yearItems.START) + Math.floor(self.yearItems.PAGE_SIZE / 2);
    self.yearItems.currentIndex_ = (self.initialDate.year() - self.yearItems.START) + 1;
};


CalenderCtrl.prototype.buildMonthCells = function(){
	var self = this;
	self.monthCells = moment.months();
};

CalenderCtrl.prototype.buildDateCells = function(){
	var self = this;
	var currentMonth = self.initialDate.month();
    var calStartDate  = self.initialDate.clone().date(0).day(self.startDay);
    var weekend = false;
    var isDisabledDate =false;

    /*
    	Check if min date is greater than first date of month
    	if true than set stopScrollPrevious=true 
    */
	if(!angular.isUndefined(self.minDate)){	
		self.stopScrollPrevious	 = self.minDate.unix() > calStartDate.unix();
	}

    self.dateCells =[];
	for (var i = 0; i < 6; i++) {
		var week = [];
		for (var j = 0; j < 7; j++) {
			
			var isCurrentMonth = (calStartDate.month()=== currentMonth);	
			

			if(isCurrentMonth){isDisabledDate=false}else{isDisabledDate=true};
			

			if(self.restrictToMinDate && !angular.isUndefined(self.minDate) && !isDisabledDate)
				isDisabledDate = self.minDate.isAfter(calStartDate);
			
			if(self.restrictToMaxDate && !angular.isUndefined(self.maxDate) && !isDisabledDate)
				isDisabledDate = self.maxDate.isBefore(calStartDate);
			

			var  day = {
	            	date : calStartDate.clone(),
	                dayNum: isCurrentMonth ? calStartDate.date() :"",
	                month : calStartDate.month(),
	                today: calStartDate.isSame(moment(),'day') && calStartDate.isSame(moment(),'month'),
	                year : calStartDate.year(),
	                dayName : calStartDate.format('dddd'),
	                isWeekEnd : weekend,
	                isDisabledDate : isDisabledDate,
	                isCurrentMonth : isCurrentMonth
			};
			
			week.push(day);
            calStartDate.add(1,'d')
		}
		self.dateCells.push(week);
	}
    /*
    	Check if max date is greater than first date of month
    	if true than set stopScrollPrevious=true 
    */
	if(self.restrictToMaxDate && !angular.isUndefined(self.maxDate)){	
		self.stopScrollNext	= self.maxDate.unix() < calStartDate.unix();
	}

	if(self.dateCells[0][6].isDisabledDate && !self.dateCells[0][6].isCurrentMonth){
		self.dateCells[0].splice(0);
	}

};

CalenderCtrl.prototype.changePeriod = function(c){
	var self = this;
	if(c === 'p'){
		if(self.stopScrollPrevious) return;
		self.moveCalenderAnimation='slideLeft';
		self.initialDate.subtract(1,'M');
	}else{
		if(self.stopScrollNext) return;
		self.moveCalenderAnimation='slideRight';
		self.initialDate.add(1,'M');
	}

	self.buildDateCells();
	self.$timeout(function(){
		self.moveCalenderAnimation='';
	},500);
};


CalenderCtrl.prototype.selectDate = function(d,isDisabled){
	var self = this;
	if (isDisabled) return;
	self.currentDate = d;
	self.setNgModelValue(d);

	self.$scope.$emit('calender:date-selected');

}


CalenderCtrl.prototype.buildDateCellHeader = function(startFrom){
	var self = this;
	var daysByName = self.picker.daysNames;
	
	var keys = [];
	for (var key in daysByName) {
		keys.push(key)
	}
	var startIndex = moment().day(self.startDay).day(), count = 0;
	for (var key in daysByName) {

    	self.dateCellHeader.push(daysByName[ keys[ (count + startIndex) % (keys.length)] ]);
        count++; // Don't forget to increase count.
    }  
}
/*
	Month Picker
*/

CalenderCtrl.prototype.changeView = function(view){
	var self = this;
	self.view =view;
}

/*
	Year Picker
*/


CalenderCtrl.prototype.changeYear = function(yr){
	var self = this;
	self.initialDate.year(yr);
	self.buildDateCells();
	self.view='DATE';	
}

/*
	Hour and Time
*/


CalenderCtrl.prototype.setHour = function(h){
	var self = this;
	self.currentDate.hour(h);
}

CalenderCtrl.prototype.setMinute = function(m){
	var self = this;
	self.currentDate.minute(m);
}

CalenderCtrl.prototype.selectedDateTime = function(){
	var self = this;
	self.setNgModelValue(self.currentDate);
	if(self.mode === 'time') 
		self.view='HOUR' 
	else 
		self.view='DATE';
	self.$scope.$emit('calender:close');			
}

CalenderCtrl.prototype.closeDateTime = function(){
	var self = this;
	if(self.mode === 'time') 
		self.view='HOUR' 
	else 
		self.view='DATE';
	self.$scope.$emit('calender:close');

}



function DateTimePicker($mdUtil,$mdMedia,$document,$timeout,picker){
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
	    closeOnSelect:"@"
      },
      template: '  <md-input-container  >'
                +'    <label for="{{fname}}">{{lable }}</label>'
                +'    <input name="{{fname}}" ng-model="value" ng-readonly="true"'
                +'             type="text" placeholde="{{lable}}"'
                +'             aria-label="{{fname}}" data-ng-required="isRequired"'
                +'             ng-focus="show()" server-error class="sm-input-container">'
                +'    <div ng-messages="form.fname.$error" ng-if="form[fname].$touched">'
                +'    		<div ng-messages-include="{{ngMassagedTempaltePath}}"></div>'
                +'    </div>'
                +'    	<div id="picker" class="sm-calender-pane md-whiteframe-15dp">'
                +'     		<sm-date-picker '
                +'              id="{{fname}}Picker" '  
                +'              ng-model="value" '
                +'				initial-date="{{value}}"'
                +'              mode="{{mode}}" '
                +'				close-on-select="{{closeOnSelect}}"'
                +'              start-view="{{startView}}" '  
                +'              data-min-date="minDate" '
                +'              data-max-date="maxDate"  '
                +'              format="{{format}}"  '
                +'          	start-day="{{weekStartDay}}" > '
                +'			</sm-date-picker>'
                +'    	</div>'                
                +'  </md-input-container>',
      link :  function(scope,$element,attr){

        console.log(picker.massagePath)

        var inputPane = $element[0].querySelector('.sm-input-container');
        var calenderPane = $element[0].querySelector('.sm-calender-pane');
        var cElement = angular.element(calenderPane);
        scope.ngMassagedTempaltePath =picker.path;
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
            calenderPane.style.left = (bodyRect.width-282)/2+'px';
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

        function hideElement(){
			cElement.addClass('hide-animate');
        	cElement.removeClass('show');
          	 //this is only for animation
            //calenderPane.parentNode.removeChild(calenderPane);          
            $mdUtil.enableScrolling();
        }
        //listen to emit for closing calender
        scope.$on('calender:close',function(){
        	hideElement();
        });
    }
  }
} 

function smTimePickerNew($mdUtil,$mdMedia,$document,$timeout,picker){
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
	    closeOnSelect:"@"
      },
      template: '  <md-input-container  >'
                +'    <label for="{{fname}}">{{lable }}</label>'
                +'    <input name="{{fname}}" ng-model="value" ng-readonly="true"'
                +'             type="text" placeholde="{{lable}}"'
                +'             aria-label="{{fname}}" data-ng-required="isRequired"'
                +'             ng-focus="show()" server-error class="sm-input-container">'
                +'    <div ng-messages="form.fname.$error" ng-if="form[fname].$touched">'
                +'    		<div ng-messages-include="{{ngMassagedTempaltePath}}"></div>'
                +'    </div>'
                +'    <div id="picker" class="sm-calender-pane md-whiteframe-15dp">'
                +'     		<sm-time-pickern '
                +'              id="{{fname}}Picker" '  
                +'              ng-model="value" '
                +'				initial-date="{{value}}"'
                +'              mode="{{mode}}" '
                +'				close-on-select="{{closeOnSelect}}"'
                +'              start-view="{{startView}}" '  
                +'              data-min-date="minDate" '
                +'              data-max-date="maxDate"  '
                +'              format="{{format}}"  '
                +'          	start-day="{{weekStartDay}}" > '
                +'			</sm-time-pickern>'
                +'    </div>'                
                +'  </md-input-container>',
      link :  function(scope,$element,attr){
        var inputPane = $element[0].querySelector('.sm-input-container');
        var calenderPane = $element[0].querySelector('.sm-calender-pane');
        var cElement = angular.element(calenderPane);
        scope.ngMassagedTempaltePath =picker.path;
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
            calenderPane.style.left = (bodyRect.width-282)/2+'px';
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

        function hideElement(){
			cElement.addClass('hide-animate');
        	cElement.removeClass('show');
          	 //this is only for animation
            //calenderPane.parentNode.removeChild(calenderPane);          
            $mdUtil.enableScrolling();
        }
        //listen to emit for closing calender
        scope.$on('calender:close',function(){
        	hideElement();
        });
    }
  }
} 


function picker(){
    var massagePath = "X";
    var cancelLabel = "Cancel";
    var okLabel = "Ok";


    //date picker configuration
    var daysNames =  [
        {'single':'S','shortName':'Su','fullName':'Sunday'}, 
        {'single':'M','shortName':'Mo','fullName':'MonDay'}, 
        {'single':'T','shortName':'Tu','fullName':'TuesDay'}, 
        {'single':'W','shortName':'We','fullName':'Wednesday'}, 
        {'single':'T','shortName':'Th','fullName':'Thursday'}, 
        {'single':'F','shortName':'Fr','fullName':'Friday'}, 
        {'single':'S','shortName':'Sa','fullName':'Saturday'}
    ];

    var dayHeader = "single";

    var monthNames = moment.months();

    //range picker configuration
    var rangeDivider = "To";
    var rangeDefaultList = ['Today',
            'Last 7 Days',
            'This Month',
            'Last Month',
            'This Quarter',
            'Year To Date',
            'This Year', 
            'Custome Range'];

    var rangeCustomStartEnd =['Start Date','End Date'];            

	
    return{
		setMassagePath : function(param){
			massagePath = param;
		},
		setDivider : function(value){
			divider = value
		},  
        setDaysNames : function(array){
            daysNames =array;
        },
        setMonthNames : function(array){
            monthNames = array;
        }, 
        setDayHeader : function(param){
            dayHeader = param;
        },
        setOkLabel : function(param){
            okLabel = param;
        },               
        setCancelLabel : function(param){
            cancelLabel = param;
        },     
        setRangeDefaultList : function(array){
            rangeDefaultList = array;
        },
        setRangeCustomStartEnd : function(array){
            rangeCustomStartEnd = array;
        },                          
		$get: function(){
			return {
				massagePath : massagePath,
                cancelLabel: cancelLabel,
                okLabel : okLabel,

                daysNames : daysNames,
                monthNames:monthNames,
                dayHeader :dayHeader,

                rangeDivider : rangeDivider,
                rangeCustomStartEnd : rangeCustomStartEnd,
                rangeDefaultList :rangeDefaultList                 
			}
		}
	}
}

var app = angular.module('smDateTimeRangePicker');

app.directive('smCalender',['$timeout','picker',Calender]);
app.directive('smDateTimePicker',['$mdUtil','$mdMedia','$document','$timeout','picker',DateTimePicker]);
app.directive('smTimePickerNew',['$mdUtil','$mdMedia','$document','$timeout','picker',smTimePickerNew]);

app.provider('picker',[picker]);

})();
(function(){

'use strict';

function TimePicker(){
	return {
	  restrict : 'E',
	  replace:true,
      require: ['^ngModel', 'smTime'],
      scope :{
	      	initialTime : "@",
	      	format:"@",
	    },
	   	controller:["$scope","$timeout",TimePickerCtrl],
	    controllerAs : 'vm',
	    templateUrl:"calender-hour.html",
		link : function(scope,element,att,ctrls){
			var ngModelCtrl = ctrls[0];
	        var calCtrl = ctrls[1];
	        calCtrl.configureNgModel(ngModelCtrl);

			scope.$on('$destroy',function(){
			   element.remove();
			});
		}      
	}
}

var TimePickerCtrl = function($scope,$timeout){
	var self  = this;
	self.$scope = $scope;
	self.$timeout = $timeout;
	self.initialDate = $scope.initialDate; 	//if calender to be  initiated with specific date 
	self.format = $scope.format;
	self.hourCells =[];
	self.minuteCells =[];
	self.moveCalenderAnimation='';
	self.format = angular.isUndefined(self.format) ? 'HH:mm': self.format;
	self.initialDate =	angular.isUndefined(self.initialDate)? moment() : moment(self.initialDate,self.format);
	self.currentDate = self.initialDate.clone();
	self.init();
	self.show=true;
}


 TimePickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
    this.ngModelCtrl = ngModelCtrl;
    var self = this;
    ngModelCtrl.$render = function() {
      self.ngModelCtrl.$viewValue= self.currentDate;
    };
  };


  TimePickerCtrl.prototype.setNgModelValue = function(date) {
  	var self = this;
    self.ngModelCtrl.$setViewValue(date);
    self.ngModelCtrl.$render();
  };

TimePickerCtrl.prototype.init = function(){
	var self = this;
	self.buidHourCells();
	self.buidMinuteCells();
	self.headerDispalyFormat = "HH:mm";
};


TimePickerCtrl.prototype.buidHourCells = function(){
	var self = this;
	for (var i = 0 ; i <= 23; i++) {
		var hour={
			hour : i,
			isCurrent :(self.initialDate.hour())=== i 
		}
		self.hourCells.push(hour);
	};	
};

TimePickerCtrl.prototype.buidMinuteCells = function(){
	var self = this;
	for (var i = 0 ; i <= 59; i++) {
		var minute = {
			minute : i,
			isCurrent : (self.initialDate.minute())=== i,
		}
		self.minuteCells.push(minute);
	};
};


TimePickerCtrl.prototype.selectDate = function(d,isDisabled){
	var self = this;
	if (isDisabled) return;
	self.currentDate = d;

	self.$scope.$emit('calender:date-selected');

}


TimePickerCtrl.prototype.setHour = function(h){
	var self = this;
	self.currentDate.hour(h);
	self.setNgModelValue(self.currentDate.format(self.format));	
}

TimePickerCtrl.prototype.setMinute = function(m){
	var self = this;
	self.currentDate.minute(m);
	self.setNgModelValue(self.currentDate.format(self.format));		
}

TimePickerCtrl.prototype.selectedDateTime = function(){
	var self = this;
	self.setNgModelValue(self.currentDate.format(self.format));
	if(self.mode === 'time') 
		self.view='HOUR' 
	else 
		self.view='DATE';
	self.$scope.$emit('calender:close');			
}

var app = angular.module('smDateTimeRangePicker');

app.directive('smTime',['$timeout',TimePicker]);


})();

(function(){

'use strict';

function DatePickerDir($timeout,picker){
	return {
	  restrict : 'E',
      require: '^ngModel',
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
	    templateUrl:"date-picker.html",
		link : function(scope,element,att,ngModelCtrl){
			setViewMode(scope.mode)
			console.log(picker.okLabel);
			scope.okLabel = picker.okLabel;
			scope.cancelLabel = picker.cancelLabel;			


			scope.currentDate = isNaN(ngModelCtrl.$viewValue)  ? moment(): ngModelCtrl.$viewValue ;

			function setViewMode(mode){
				switch(mode) {
				    case 'date-time':
						scope.view = 'DATE'
						scope.headerDispalyFormat = "ddd, MMM DD HH:mm";			
				        break;
				    case 'time':
				        scope.view = 'HOUR';
						scope.headerDispalyFormat = "HH:mm";
				        break;
				    default:
				        scope.view = 'DATE';
				}					
			}

			scope.$on('calender:date-selected',function(){
				if(scope.closeOnSelect && (scope.mode!=='date-time' || scope.mode!=='time')){
					var date = moment(scope.selectedDate,scope.format);
					if(!date.isValid()){
						date = moment();
						scope.selectedDate =date;
					}
					if(!angular.isUndefined(scope.selectedTime)){	
						var timeSplit = scope.selectedTime.split(':');
						date.hour(timeSplit[0]).minute(timeSplit[1]);
					}
					scope.currentDate =scope.selectedDate;
					ngModelCtrl.$setViewValue(date.format(scope.format));
					ngModelCtrl.$render();
					setViewMode(scope.mode)
					scope.$emit('calender:close');			

				}
			})

			scope.selectedDateTime = function(){
				var date = moment(scope.selectedDate,scope.format);
				if(!date.isValid()){
					date = moment();
					scope.selectedDate =date;
				}
				if(!angular.isUndefined(scope.selectedTime)){	
					var timeSplit = scope.selectedTime.split(':');
					date.hour(timeSplit[0]).minute(timeSplit[1]);
				}
				scope.currentDate =scope.selectedDate;
				ngModelCtrl.$setViewValue(date.format(scope.format));
				ngModelCtrl.$render();
				setViewMode(scope.mode)
				scope.$emit('calender:close');			
			}


			scope.closeDateTime = function(){
				scope.$emit('calender:close');			
			}

		}      
	}
}

function TimePickerDir1($timeout,picker){
	return {
	  restrict : 'E',
      require: '^ngModel',
      replace:true,
      scope :{
	      	initialDate : "@",
	      	format:"@",
	      	mode:"@",	      	
	      	startDay:"@",
	      	closeOnSelect:"@"
	    },
	    templateUrl:"date-picker.html",
		link : function(scope,element,att,ngModelCtrl){
			setViewMode(scope.mode)
		    
		    scope.okLabel = picker.okLabel;
		    scope.cancelLabel = picker.cancelLabel;

			scope.currentDate = isNaN(ngModelCtrl.$viewValue)  ? moment(): ngModelCtrl.$viewValue ;

			function setViewMode(mode){
				switch(mode) {
				    case 'date-time':
						scope.view = 'DATE'
						scope.headerDispalyFormat = "ddd, MMM DD HH:mm";			
				        break;
				    case 'time':
				        scope.view = 'HOUR';
						scope.headerDispalyFormat = "HH:mm";
				        break;
				    default:
				        scope.view = 'DATE';
				}					
			}

			scope.$on('calender:date-selected',function(){
				if(scope.closeOnSelect && (scope.mode!=='date-time' || scope.mode!=='time')){
					var date = moment(scope.selectedDate,scope.format);
					if(!date.isValid()){
						date = moment();
						scope.selectedDate =date;
					}
					if(!angular.isUndefined(scope.selectedTime)){	
						var timeSplit = scope.selectedTime.split(':');
						date.hour(timeSplit[0]).minute(timeSplit[1]);
					}
					scope.currentDate =scope.selectedDate;
					ngModelCtrl.$setViewValue(date.format(scope.format));
					ngModelCtrl.$render();
					setViewMode(scope.mode)
					scope.$emit('calender:close');			

				}
			})

			scope.selectedDateTime = function(){
				var date = moment(scope.selectedDate,scope.format);
				if(!date.isValid()){
					date = moment();
					scope.selectedDate =date;
				}
				if(!angular.isUndefined(scope.selectedTime)){	
					var timeSplit = scope.selectedTime.split(':');
					date.hour(timeSplit[0]).minute(timeSplit[1]);
				}
				scope.currentDate =scope.selectedDate;
				ngModelCtrl.$setViewValue(date.format(scope.format));
				ngModelCtrl.$render();
				setViewMode(scope.mode)
				scope.$emit('calender:close');			
			}


			scope.closeDateTime = function(){
				scope.$emit('calender:close');			
			}

		}      
	}
}


var app = angular.module('smDateTimeRangePicker');

app.directive('smDatePicker',['$timeout','picker',DatePickerDir]);
app.directive('smTimePickern',['$timeout','picker',TimePickerDir1]);


})();



(function(){

'use strict';

function RangePickerInput($document,$mdMedia,$mdUtil,picker){
    return {
      restrict : 'EA',
      replace: true,
      scope :{
        value: '=',
        fname : "@",
        lable : "@",
        isRequired : '@',
        disable : '=',
        form : '=',
        format : '@',
        divider: '@'
      },
      template: ' <md-input-container>'
                +'    <label for="{{fname}}">{{lable}}</label>'
                +'      <input name="{{fname}}" ng-model="value" ng-readonly="true"'
                +'             type="text" placeholde="{{lable}}"'
                +'             aria-label="{{fname}}" ng-required="{{isRequired}}" class="sm-input-container"'
                +'             ng-focus="show()">'
                +'    <sm-range-picker class="sm-calender-pane  md-whiteframe-15dp" ng-model="value" divider="{{divider}}" format="{{format}}" ></sm-range-picker>'
                +'  </md-input-container>',
      link :  function(scope,$element,attr){

        var inputPane = $element[0].querySelector('.sm-input-container');
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
              //angular.element(inputPane).focus();
            }
        });

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
    }
  }
} 




function smRangePicker (picker){
  return{
    restrict : 'E',
    require : ['ngModel','smRangePicker'],
    scope:{
      format:'@',
      divider: '@'
    },
    controller: ['$scope','picker',RangePickerCtrl],
    controllerAs : 'vm',
    templateUrl : 'range-picker.html',
    link : function(scope,element,att,ctrls){
      var ngModelCtrl = ctrls[0];
      var calCtrl = ctrls[1];
      calCtrl.configureNgModel(ngModelCtrl);

    }    
  }
}

var RangePickerCtrl = function($scope,picker){
  var self = this;
  self.scope = $scope;
  self.clickedButton = 0;
  self.format = angular.isUndefined($scope.format) ? 'MM-DD-YYYY': $scope.format;
  self.showCustom=false;
  self.startDate = moment();
  self.endDate = moment();
  console.log(picker.rangeDivider );
  self.divider = angular.isUndefined(self.scope.divider) || self.scope.divider ===''? picker.rangeDivider : $scope.divider;
  console.log(self.divider);  
  self.okLabel = picker.okLabel;
  self.cancelLabel = picker.cancelLabel;
  self.rangeDefaultList = picker.rangeDefaultList;
  self.rangeCustomStartEnd = picker.rangeCustomStartEnd;

//  console.log(rangeDefaultList);

  self.selectedTabIndex = $scope.selectedTabIndex;

  self.scope.$on('calender:date-selected',function(){
    self.selectedTabIndex =1;
  });        

}

RangePickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
    this.ngModelCtrl = ngModelCtrl;
    var self = this;
    ngModelCtrl.$render = function() {
      self.ngModelCtrl.$viewValue= self.startDate+' '+ self.divider +' '+self.endDate;
    };
};

RangePickerCtrl.prototype.dateRangeSelected = function(){
    var self = this;
    self.selectedTabIndex =0;
    self.showCustom=false;
    self.setNgModelValue(self.startDate,self.divider,self.endDate);
}

RangePickerCtrl.prototype.preDefineDate = function(p){
    var self = this;  
    self.clickedButton=p;
    var instance = moment();
    switch (p){
      case 1:
        self.startDate = instance.clone().startOf('day');
        self.endDate = instance.clone().endOf('day');
        break;
      case 2:
        self.startDate = instance.clone().subtract(7,'d');
        self.endDate = instance.clone();
        break;
      case 3:
        self.startDate = instance.clone().startOf('month');
        self.endDate = instance.endOf('month');
        break;
      case 4:
        self.startDate = instance.clone().subtract(1,'month').startOf('month');
        self.endDate = instance.clone().endOf('month');
        break;
      case 5:
        self.startDate = instance.clone().startOf('quarter');
        self.endDate = instance.clone().endOf('quarter');
        break;
      case 6:
        self.startDate = instance.clone().startOf('year');
        self.endDate = instance.clone().endOf('year');
        break;
      case 7:
        self.showCustom=true;
        self.selectedTabIndex=0
        break;
      case 8:
        self.startDate = instance.clone().startOf('year');
        self.endDate = instance.clone();
        break;
      default:
        break;
    }
    if(p!=7){
      self.setNgModelValue(self.startDate,self.divider,self.endDate);
    }
} 

RangePickerCtrl.prototype.setNgModelValue = function(startDate,divider,endDate) {
    var self = this;
    self.ngModelCtrl.$setViewValue(startDate.format(self.scope.format)+' '+ divider +' '+endDate.format(self.scope.format));
    self.ngModelCtrl.$render();
    self.scope.$emit('range-picker:close');    
};

RangePickerCtrl.prototype.cancel = function(){
  var self = this;
  self.scope.$emit('range-picker:close');        
}

var app = angular.module('smDateTimeRangePicker');

app.directive('smRangePicker',['picker',smRangePicker]);
app.directive('smRangePickerInput',['$document','$mdMedia','$mdUtil','picker',RangePickerInput]);

})();

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

app.directive('smTimePicker',['$timeout',TimePickerDir]);


})();


