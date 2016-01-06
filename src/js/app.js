'use strict';


function run($templateCache){

var calender-date.html = '<div  class="date-picker">
\n			<div ng-show="vm.view===\'YEAR_MONTH\'" ng-class="{\'year-container\' : vm.view===\'YEAR_MONTH\'}"> 
\n				<md-virtual-repeat-container id="year-container" class="year-md-repeat" md-top-index="vm.topIndex">
\n				      <div md-virtual-repeat="yr in vm.yearCells" class="repeated-item" flex>
\n						<md-button class="md-button" 
\n							ng-click="vm.changeYear(yr)" 							
\n							ng-class="{\'md-primary\': yr === vm.currentDate.year(),
\n										\'md-primary md-raised\' :yr ===vvm.currentDate.year()}">
\n							{{yr}}
\n						</md-button>				          
\n				      </div>
\n				</md-virtual-repeat-container>		     
\n			</div>				
\n			<div ng-show="vm.view===\'DATE\'" ng-class="{\'date-container\' : vm.view===\'DATE\'}">
\n				<div layout="row" class="navigation" layout-align="space-between center">
\n						<md-button 
\n							ng-disabled="vm.stopScrollPrevious" 
\n							class="md-icon-button scroll-button" 
\n							aria-label="privious" 
\n							ng-click="vm.changePeriod(\'p\')">
\n								<md-icon md-font-icon="material-icons">keyboard_arrow_left</md-icon>					
\n						</md-button>
\n						<md-button class="md-button" ng-class="vm.moveCalenderAnimation" ng-click="vm.changeView(\'YEAR_MONTH\')">
\n							{{vm.initialDate.format(\'MMM YYYY\')}}
\n						</md-button>			
\n						<md-button  
\n							ng-disabled="vm.stopScrollNext" 
\n							class="md-icon-button scroll-button" 
\n							aria-label="next" 
\n							ng-click="vm.changePeriod(\'n\')">
\n							<md-icon md-font-icon="material-icons">keyboard_arrow_right</md-icon>	
\n						</md-button>				
\n				</div>			
\n				<div layout="row" class="date-cell-header">
\n					<md-button class="md-icon-button" ng-disabled="true" ng-repeat="dHead in vm.dateCellHeader">
\n						{{dHead[\'single\']}}
\n					</md-button>
\n				</div>		
\n				<div 
\n					md-swipe-right="vm.changePeriod(\'p\')" 
\n					class="date-cell-row" 
\n					md-swipe-left="vm.changePeriod(\'n\')" 
\n					ng-class="vm.moveCalenderAnimation">
\n					<div layout="row" ng-repeat="w in vm.dateCells" >
\n						<md-button
\n							ng-repeat="d in w"
\n							class="md-icon-button"
\n							ng-click="vm.selectDate(d.date,d.isDisabledDate)"
\n							ng-disabled="d.isDisabledDate"
\n							ng-class="{\'md-primary\' : d.today,
\n								\'active\':d.isCurrentMonth,
\n								\'md-primary md-raised selected\' :d.date.isSame(vm.currentDate),
\n								\'disabled\':d.isDisabledDate}">
\n							<span>{{d.dayNum}}</span>
\n						</md-button>
\n					</div>
\n				</div>
\n			</div>
\n</div>
\n';
var calender-hour.html = '<div  class="hour-picker">
\n	<div class="hour-container">
\n	<div layout="row" class="hour-header">
\n		<span flex="50">Hour</span>
\n		<span flex="50">Minute</span>	
\n	</div>
\n	<md-virtual-repeat-container id="hour-container" class="hour-md-repeat" >
\n		<div md-virtual-repeat="h in vm.hourCells"  class="repeated-item" >
\n			<md-button class="md-icon-button" 
\n				ng-click="vm.setHour(h.hour)" 							
\n				ng-class="{\'md-primary\': h.isCurrent,
\n						\'md-primary md-raised\' :h.hour===vm.currentDate.hour()}">
\n				{{h.hour}}
\n			</md-button>
\n		</div>
\n	</md-virtual-repeat-container>		     
\n	<md-virtual-repeat-container id="minute-container" class="minute-md-repeat" >
\n		<div md-virtual-repeat="m in vm.minuteCells" class="repeated-item" >
\n			<md-button class="md-icon-button" 
\n				ng-click="vm.setMinute(m.minute)" 							
\n				ng-class="{\'md-primary\': m.isCurrent,
\n					\'md-primary md-raised\' :m.minute===vm.currentDate.minute()}">
\n				{{m.minute}}
\n			</md-button>
\n		</div>
\n	</md-virtual-repeat-container>		     
\n</div>
\n</div>';
var date-picker.html = '<div class="picker-container">
\n	<md-content  class="container md-whiteframe-15dp" >
\n		<md-toolbar class="md-height header" >
\n			<div class="md-toolbar-tools" layout="row">
\n				<div layout="column" flex="100" class="">
\n					<span flex ng-hide="vm.view===\'HOUR\'" class="md-subhead">{{currentDate.format(\'YYYY\')}}</span>
\n					<span flex class="selected-date">
\n						{{currentDate}}			
\n					</span>
\n				</div>
\n			</div>	
\n		</md-toolbar>
\n		<div ng-show="view===\'DATE\'" >
\n			<sm-calender 
\n				ng-model="selectedDate"
\n				id="{{fname}}Picker" 
\n				data-mode="{{mode}}" 
\n				data-min-date="minDate" 
\n				data-max-date="maxDate"  
\n				data-format="{{format}}"  
\n				data-start-day="{{weekStartDay}}">
\n			</sm-calender>
\n		</div>
\n		<div ng-show="view===\'HOUR\'">
\n			<sm-time
\n				ng-model="selectedTime"
\n				data-format="HH:mm">
\n			</sm-time>
\n		</div>		
\n		<div class="action">
\n			<div layout="row" layout-align="end center">
\n				<div ng-show="mode===\'date-time\'">
\n					<md-button class="md-icon-button" ng-show="view===\'DATE\'" ng-click="view=\'HOUR\'">
\n						<md-icon md-font-icon="material-icons md-primary">access_time</md-icon>
\n					</md-button>				
\n					<md-button class="md-icon-button" ng-show="view===\'HOUR\'" ng-click="view=\'DATE\'">
\n						<md-icon md-font-icon="material-icons md-primary">date_range</md-icon>
\n					</md-button>
\n				</div>												
\n				<span flex></span>
\n				<md-button class="md-button md-primary" ng-click="closeDateTime()">Cancel</md-button>
\n				<md-button class="md-button md-primary" ng-click="selectedDateTime()">Ok</md-button>
\n			</div>
\n		</div>
\n	</md-content>	
\n</div>';
var range-picker.html = '<div layout="column"  id="{{id}}" class="range-picker md-whiteframe-2dp" >
\n    <md-toolbar layout="row"  class="md-primary" >
\n      	<div class="md-toolbar-tools"  layout-align="center center">
\n			<div flex class="date-display"><span>{{vm.startDate}}</span></div>
\n			<div flex class="date-display"><span>{{vm.endDate}}</span></div>
\n		</div>
\n	</md-toolbar>
\n	<div  layout="column" flex class="pre-select"  role="button" ng-show="!vm.showCustom">
\n		<md-button ng-class="{\'md-primary\': vm.clickedButton===1}" ng-click="vm.preDefineDate(1)">Today</md-button>
\n		<md-button ng-class="{\'md-primary\': vm.clickedButton===2}" ng-click="vm.preDefineDate(2)">Last 7 Days</md-button>		
\n		<md-button ng-class="{\'md-primary\': vm.clickedButton===3}"  ng-click="vm.preDefineDate(3)">This Month</md-button>
\n		<md-button ng-class="{\'md-primary\': vm.clickedButton===4}"  ng-click="vm.preDefineDate(4)">Last Month</md-button>
\n		<md-button ng-class="{\'md-primary\': vm.clickedButton===5}"  ng-click="vm.preDefineDate(5)">This Quarter</md-button>	
\n		<md-button ng-class="{\'md-primary\': vm.clickedButton===8}" ng-click="vm.preDefineDate(8)">Year To Date</md-button>		
\n		<md-button ng-class="{\'md-primary\': vm.clickedButton===6}"  ng-click="vm.preDefineDate(6)">This Year</md-button>	
\n		<md-button ng-class="{\'md-primary\': vm.clickedButton===7}"  ng-click="vm.preDefineDate(7)">Custom Date</md-button>
\n	</div>
\n	<div layout="column" layout-sm="column" class="custom-select" flex ng-show="vm.showCustom" ng-class="{\'show-calender\': vm.showCustom}">
\n		<div layout="row"   class="tab-head">
\n			<span layout="column" class="md-ink-ripple" ng-class="{\'active\':vm.selectedTabIndex===0}">Start Date</span>
\n			<span layout="column" class="md-ink-ripple" ng-class="{\'active  slideInLeft\':vm.selectedTabIndex===1}">End Date</span>			
\n		</div>
\n		<div ng-show="vm.selectedTabIndex===0" ng-model="vm.startDate" >
\n			<sm-calender 
\n				week-start-day="Sunday">
\n			</sm-calender>
\n		</div>
\n		<div ng-if="vm.selectedTabIndex===1" ng-model="vm.endDate" >
\n			<sm-calender 
\n				initial-date="{{vm.startDate}}"
\n				min-date="vm.startDate"
\n				week-start-day="Sunday">
\n			</sm-calender>
\n		</div>								
\n	</div>
\n	<md-divider></md-divider>
\n	<div layout="row" layout-align="center center">
\n		<md-button type="button" class="md-primary md-raised"   ng-click="vm.dateRangeSelected()">Ok</md-button>	
\n		<md-button type="button" ng-click="vm.cancel()">Cancel</md-button>						
\n	</div>	
\n</div>';

	$templateCache.put('calender-date.html',calender-date.html);			
	$templateCache.put('calender-hour.html',calender-hour.html);			
	$templateCache.put('date-picker.html',date-picker.html);					
	$templateCache.put('range-picker.html',range-picker.html);			
}


angular
  .module('dateTimePicker', [
    'ngAnimate',
    'ngMaterial'
  ])
  .run(['$templateCache',run]);
    