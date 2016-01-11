'use strict';

function run($templateCache){

	var calenderdatehtml =  '<div  class="date-picker">'+
		'           <div ng-show="vm.view===\'YEAR_MONTH\'" ng-class="{\'year-container\' : vm.view===\'YEAR_MONTH\'}"> '+
		'               <md-virtual-repeat-container id="year-container" class="year-md-repeat" md-top-index="vm.topIndex">'+
		'                     <div md-virtual-repeat="yr in vm.yearCells" class="repeated-item" flex>'+
		'                       <md-button class="md-button" '+
		'                           ng-click="vm.changeYear(yr)"                            '+
		'                           ng-class="{\'md-primary\': yr === vm.currentDate.year(),'+
		'                                       \'md-primary md-raised\' :yr ===vvm.currentDate.year()}">'+
		'                           {{yr}}'+
		'                       </md-button>                          '+
		'                     </div>'+
		'               </md-virtual-repeat-container>           '+
		'           </div>              '+
		'           <div ng-show="vm.view===\'DATE\'" ng-class="{\'date-container\' : vm.view===\'DATE\'}">'+
		'               <div layout="row" class="navigation" layout-align="space-between center">'+
		'                       <md-button '+
		'                           ng-disabled="vm.stopScrollPrevious" '+
		'                           class="md-icon-button scroll-button" '+
		'                           aria-label="privious" '+
		'                           ng-click="vm.changePeriod(\'p\')">'+
		'                               <md-icon md-font-icon="material-icons">keyboard_arrow_left</md-icon>                    '+
		'                       </md-button>'+
		'                       <md-button class="md-button" ng-class="vm.moveCalenderAnimation" ng-click="vm.changeView(\'YEAR_MONTH\')">'+
		'                           {{vm.initialDate.format(\'MMMM YYYY\')}}'+
		'                       </md-button>            '+
		'                       <md-button  '+
		'                           ng-disabled="vm.stopScrollNext" '+
		'                           class="md-icon-button scroll-button" '+
		'                           aria-label="next" '+
		'                           ng-click="vm.changePeriod(\'n\')">'+
		'                           <md-icon md-font-icon="material-icons">keyboard_arrow_right</md-icon>   '+
		'                       </md-button>                '+
		'               </div>          '+
		'               <div layout="row" class="date-cell-header">'+
		'                   <md-button class="md-icon-button" ng-disabled="true" ng-repeat="dHead in vm.dateCellHeader">'+
		'                       {{dHead[\'single\']}}'+
		'                   </md-button>'+
		'               </div>      '+
		'               <div '+
		'                   md-swipe-right="vm.changePeriod(\'p\')" '+
		'                   class="date-cell-row" '+
		'                   md-swipe-left="vm.changePeriod(\'n\')" '+
		'                   ng-class="vm.moveCalenderAnimation">'+
		'                   <div layout="row" ng-repeat="w in vm.dateCells" >'+
		'                       <md-button'+
		'                           ng-repeat="d in w"'+
		'                           class="md-icon-button"'+
		'                           ng-click="vm.selectDate(d.date,d.isDisabledDate)"'+
		'                           ng-disabled="d.isDisabledDate"'+
		'                           ng-class="{\'md-primary\' : d.today,'+
		'                               \'active\':d.isCurrentMonth,'+
		'                               \'md-primary md-raised selected\' :d.date.isSame(vm.currentDate),'+
		'                               \'disabled\':d.isDisabledDate}">'+
		'                           <span>{{d.dayNum}}</span>'+
		'                       </md-button>'+
		'                   </div>'+
		'               </div>'+
		'           </div>'+
		'</div>';


	var calenderhourhtml = '<div  class="hour-picker">'+
		'   <div class="hour-container">'+
		'       <div layout="row" class="hour-header">'+
		'               <span flex="50">Hour</span>'+
		'               <span flex="50">Minute</span>   '+
		'       </div>'+
		'       <md-virtual-repeat-container id="hour-container" class="hour-md-repeat" >'+
		'           <div md-virtual-repeat="h in vm.hourCells"  class="repeated-item" >'+
		'                   <md-button class="md-icon-button" '+
		'                       ng-click="vm.setHour(h.hour)"                           '+
		'                       ng-class="{\'md-primary\': h.isCurrent,'+
		'                               \'md-primary md-raised\' :h.hour===vm.currentDate.hour()}">'+
		'                       {{h.hour}}'+
		'                   </md-button>'+
		'           </div>'+
		'       </md-virtual-repeat-container>           '+
		'       <md-virtual-repeat-container id="minute-container" class="minute-md-repeat" >'+
		'           <div md-virtual-repeat="m in vm.minuteCells" class="repeated-item" >'+
		'                   <md-button class="md-icon-button" '+
		'                       ng-click="vm.setMinute(m.minute)"                           '+
		'                       ng-class="{\'md-primary\': m.isCurrent,'+
		'                           \'md-primary md-raised\' :m.minute===vm.currentDate.minute()}">'+
		'                       {{m.minute}}'+
		'                   </md-button>'+
		'           </div>'+
		'       </md-virtual-repeat-container>           '+
		'   </div>'+
		'</div>';
	var datepickerhtml = '<div class="picker-container  md-whiteframe-15dp">'+
		'   <md-content  class="container" >'+
		'       <md-toolbar class="md-height">          '+
		'           <div class="md-toolbar-tools">'+
		'               <div layout="column" flex="100" class="">'+
		'                   <span flex ng-hide="vm.view===\'HOUR\'" class="md-subhead">{{currentDate.format(\'YYYY\')}}</span>'+
		'                   <div class="date-time-header">'+
		'                       <span flex class="date-display">'+
		'                           {{currentDate.format(\'ddd, MMM DD\')}}         '+
		'                       </span>'+
		'                       <span  class="time-display" ng-show="mode===\'date-time\' || view===\'HOUR\'">'+
		'                           {{currentDate.format(\'HH:mm\')}}           '+
		'                       </span>'+
		'                   </div>                  '+
		'               </div>'+
		'           </div>  '+
		'       </md-toolbar>'+
		'       <div ng-show="view===\'DATE\'" >'+
		'           <sm-calender '+
		'               ng-model="selectedDate"'+
		'               id="{{fname}}Picker" '+
		'               data-mode="{{mode}}" '+
		'               data-min-date="minDate" '+
		'               data-max-date="maxDate" '+
		'               close-on-select="{{closeOnSelect}}"              '+
		'               data-format="{{format}}"  '+
		'               data-start-day="{{weekStartDay}}">'+
		'           </sm-calender>'+
		'       </div>'+
		'       <div ng-show="view===\'HOUR\'">'+
		'           <sm-time'+
		'               ng-model="selectedTime"'+
		'               data-format="HH:mm">'+
		'           </sm-time>'+
		'       </div>      '+
		'       <div class="action" layout="row" layout-align="end center" ng-hide="closeOnSelect && (mode!==\'date-time\' || mode!==\'time\')">'+
		'               <div ng-show="mode===\'date-time\'">'+
		'                   <md-button class="md-icon-button" ng-show="view===\'DATE\'" ng-click="view=\'HOUR\'">'+
		'                       <md-icon md-font-icon="material-icons md-primary">access_time</md-icon>'+
		'                   </md-button>                '+
		'                   <md-button class="md-icon-button" ng-show="view===\'HOUR\'" ng-click="view=\'DATE\'">'+
		'                       <md-icon md-font-icon="material-icons md-primary">date_range</md-icon>'+
		'                   </md-button>'+
		'               </div>                                              '+
		'               <span flex></span>'+
		'               <md-button class="md-button md-primary" ng-click="closeDateTime()">Cancel</md-button>'+
		'               <md-button class="md-button md-primary" ng-click="selectedDateTime()">Ok</md-button>'+
		'       </div>'+
		'   </md-content>   '+
		'</div>';

	var rangepickerhtml = '<div layout="column"  id="{{id}}" class="range-picker md-whiteframe-2dp" >'+
	'    <md-toolbar layout="row"  class="md-primary" >'+
	'       <div class="md-toolbar-tools"  layout-align="center center">'+
	'           <div flex class="date-display"><span>{{vm.startDate.format(vm.format)}}</span></div>'+
	'           <div flex class="date-display"><span>{{vm.endDate.format(vm.format)}}</span></div>'+
	'       </div>'+
	'   </md-toolbar>'+
	'   <div  layout="column" class="pre-select"  role="button" ng-show="!vm.showCustom">'+
	'               <md-button  ng-class="{\'md-primary\': vm.clickedButton===1}" ng-click="vm.preDefineDate(1)">Today</md-button>'+
	'       <md-button ng-class="{\'md-primary\': vm.clickedButton===2}" ng-click="vm.preDefineDate(2)">Last 7 Days</md-button>     '+
	'       <md-button ng-class="{\'md-primary\': vm.clickedButton===3}"  ng-click="vm.preDefineDate(3)">This Month</md-button>'+
	'       <md-button ng-class="{\'md-primary\': vm.clickedButton===4}"  ng-click="vm.preDefineDate(4)">Last Month</md-button>'+
	'       <md-button ng-class="{\'md-primary\': vm.clickedButton===5}"  ng-click="vm.preDefineDate(5)">This Quarter</md-button>   '+
	'       <md-button ng-class="{\'md-primary\': vm.clickedButton===8}" ng-click="vm.preDefineDate(8)">Year To Date</md-button>        '+
	'       <md-button ng-class="{\'md-primary\': vm.clickedButton===6}"  ng-click="vm.preDefineDate(6)">This Year</md-button>  '+
	'       <md-button ng-class="{\'md-primary\': vm.clickedButton===7}"  ng-click="vm.preDefineDate(7)">Custom Date</md-button>'+
	'   </div>'+
	'   <div layout="column" layout-sm="column" class="custom-select" flex ng-show="vm.showCustom" ng-class="{\'show-calender\': vm.showCustom}">'+
	'       <div layout="row"   class="tab-head">'+
	'           <span layout="column" class="md-ink-ripple" ng-class="{\'active moveLeft\':vm.selectedTabIndex===0}">Start Date</span>'+
	'           <span layout="column" class="md-ink-ripple" ng-class="{\'active moveLeft\':vm.selectedTabIndex===1}">End Date</span>            '+
	'       </div>'+
	'       <div ng-show="vm.selectedTabIndex===0" ng-model="vm.startDate" >'+
	'           <sm-calender '+
	'               week-start-day="Sunday">'+
	'           </sm-calender>'+
	'       </div>'+
	'       <div ng-if="vm.selectedTabIndex===1" ng-model="vm.endDate" >'+
	'           <sm-calender '+
	'               initial-date="{{vm.startDate.format(format)}}"'+
	'               min-date="vm.startDate"'+
	'               week-start-day="Sunday">'+
	'           </sm-calender>'+
	'       </div>                              '+
	'   </div>'+
	'   <md-divider></md-divider>'+
	'   <div layout="row" layout-align="end center">'+
	'       <md-button type="button" class="md-primary" ng-click="vm.cancel()">Cancel</md-button>                       '+
	'       <md-button type="button" class="md-primary" ng-click="vm.dateRangeSelected()">Ok</md-button>    '+
	'   </div>  '+
	'</div>';
	$templateCache.put('calender-date.html',calenderdatehtml);			
	$templateCache.put('calender-hour.html',calenderhourhtml);			
	$templateCache.put('date-picker.html',datepickerhtml);					
	$templateCache.put('range-picker.html',rangepickerhtml);			
}


angular
  .module('smDateTimeRangePicker', [
    'ngAnimate',
    'ngMaterial'
  ])
  .run(['$templateCache',run]);
    