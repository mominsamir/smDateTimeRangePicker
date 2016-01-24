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
    