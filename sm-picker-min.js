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
  .module('smDateTimeRangePicker', [
    'ngAnimate',
    'ngMaterial'
  ])
  .run(['$templateCache',run]);
    
(function(){
'use strict';



function Calender(){
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
	      	startDay:"@",
	      	showDisplayHeader:"@"
	    },
	   	controller:["$scope","$timeout",CalenderCtrl],
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

var CalenderCtrl = function($scope,$timeout){
	var self  = this;
	self.$scope = $scope;
	self.$timeout = $timeout;
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
	self.yearCells = [];
	self.monthCells=[];
	self.dateCellHeader= [];	
	self.dateCells = [];
	self.hourCells =[];
	self.minuteCells =[];
	self.monthList = moment.months();
	self.moveCalenderAnimation='';
	self.format = angular.isUndefined(self.format) ? 'MM-DD-YYYY': self.format;
	self.initialDate =	angular.isUndefined(self.initialDate)? moment() : moment(self.initialDate,self.format);
	self.currentDate = self.initialDate.clone();
	if(self.restrictToMinDate) 
		self.minDate = moment(self.minDate, self.format);
	if(self.restrictToMaxDate) 
		self.maxDate = moment(self.maxDate, self.format);
	self.init();
	$scope.$watch('vm.topIndex', angular.bind(this, function(topIndex) {
          var scrollYear = Math.floor(topIndex / 1);
          self.selectedYear = scrollYear;
    }));
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
	self.buildYearCells();
	self.buildDateCells();
	self.buildDateCellHeader();
	self.buildMonthCells();
	self.buidHourCells();
	self.buidMinuteCells();
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


CalenderCtrl.prototype.buildYearCells = function(y){
	var self = this;
	var startYear = self.initialDate.year() -25;
	if(!angular.isUndefined(self.minDate)){
		startYear = self.minDate.year();		
	}
	var endYear = startYear +25;
	if(!angular.isUndefined(self.maxDate)){
		endYear = self.maxDate.year();		
	}	
	for (var i = startYear ; i <= endYear; i++) {
		self.yearCells.push(i);
	};	
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

CalenderCtrl.prototype.buidHourCells = function(){
	var self = this;
	for (var i = 0 ; i <= 23; i++) {
		var hour={
			hour : i,
			isCurrent :(self.initialDate.hour())=== i 
		}
		self.hourCells.push(hour);
	};	
};

CalenderCtrl.prototype.buidMinuteCells = function(){
	var self = this;
	for (var i = 0 ; i <= 59; i++) {
		var minute = {
			minute : i,
			isCurrent : (self.initialDate.minute())=== i,
		}
		self.minuteCells.push(minute);
	};
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
	self.setNgModelValue(d.format(self.format));
	self.$scope.$emit('calender:date-selected');

}


CalenderCtrl.prototype.buildDateCellHeader = function(startFrom){
	var self = this;
	var daysByName = {
		sunday    : {'shortName':'Su','fullName':'Sunday','single':'S'}, 
		monday    : {'shortName':'Mo','fullName':'MonDay','single':'M'}, 
		tuesday   : {'shortName':'Tu','fullName':'TuesDay','single':'T'}, 
		wednesday : {'shortName':'We','fullName':'Wednesday','single':'W'}, 
		thursday  : {'shortName':'Th','fullName':'Thursday','single':'T'}, 
		friday    : {'shortName':'Fr','fullName':'Friday','single':'F'}, 
		saturday  : {'shortName':'Sa','fullName':'Saturday','single':'S'}
	}
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
	self.setNgModelValue(self.currentDate.format(self.format));
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
        form : '='
      },
      template: '  <md-input-container  >'
                +'    <label for="{{fname}}">{{lable }}</label>'
                +'    <input name="{{fname}}" ng-model="value" '
                +'             type="text" placeholde="{{lable}}"'
                +'             aria-label="{{fname}}" data-ng-required="isRequired"'
                +'             ng-focus="show()" server-error class="gj-input-container">'
                +'    <div ng-messages="form.fname.$error" ng-if="form[fname].$touched">'
                +'    		<div ng-messages-include="{{ngMassagedTempaltePath}}"></div>'
                +'    </div>'
                +'    	<div id="picker" class="gj-calender-pane">'
                +'     		<sm-date-picker '
                +'              id="{{fname}}Picker" '  
                +'              ng-model="value" '
                +'				initial-date="{{value}}"'
                +'              mode="{{mode}}" '
                +'              start-view="{{startView}}" '  
                +'              data-min-date="minDate" '
                +'              data-max-date="maxDate"  '
                +'              format="{{format}}"  '
                +'          	start-day="{{weekStartDay}}" > '
                +'			</sm-date-picker>'
                +'    	</div>'                
                +'  </md-input-container>',
      link :  function(scope,$element,attr){
        var inputPane = $element[0].querySelector('.gj-input-container');
        var calenderPane = $element[0].querySelector('.gj-calender-pane');
        var cElement = angular.element(calenderPane);
        scope.ngMassagedTempaltePath =picker.path;
        // check if Pre defined format is supplied
        scope.format = angular.isUndefined(scope.format) ? 'MM-DD-YYYY': scope.format;
        
        // Hide calender pane on initialization
        cElement.addClass('hide');

        // set start date
        scope.startDate  = angular.isUndefined(scope.value)? scope.startDate : scope.value;

        // Hide Calender on click out side
        $document.on('click', function (e) {
            if ((calenderPane !== e.target && inputPane !==e.target) && (!calenderPane.contains(e.target) && !inputPane.contains(e.target))) {
              cElement.removeClass('show').addClass('hide');
              $mdUtil.enableScrolling();      
            }
        });

        // if tab out hide key board
        angular.element(inputPane).on('keydown', function (e) {
            if(e.which===9){
              cElement.removeClass('show').addClass('hide');
              angular.element(inputPane).focus();
              $mdUtil.enableScrolling();      
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
            var top = elementRect.top - ((elementRect.top +calenderHeight) - (bodyRect.bottom -20));
          }
          var left = elementRect.left;
          if(elementRect.left +calenderWidth > bodyRect.right){
             left = elementRect.left - ((elementRect.left +calenderWidth) - (bodyRect.right -10));
          }
          return {top : top, left : left };
        }

        //listen to emit for closing calender
        scope.$on('calender:close',function(){
            cElement.removeClass('show').addClass('hide');
            calenderPane.parentNode.removeChild(calenderPane);          
            $mdUtil.enableScrolling();            
        });
        // remove element on scope destroyed
 /*       scope.$on('$destroy',function(){
          calenderPane.parentNode.removeChild(calenderPane);
        });*/

    }
  }
} 

function picker(){
	var massagePath;
	var divider= " To ";
	return{
		setMassagePath : function(param){
			massagePath = param
		},
		setDivider : function(value){
			divider = value
		},  
		$get: function(){
			return {
				path : massagePath,
				divider : divider
			}
		}
	}
}

var app = angular.module('smDateTimeRangePicker');

app.directive('smCalender',['$timeout',Calender]);
app.directive('smDateTimePicker',['$mdUtil','$mdMedia','$document','picker',DateTimePicker]);
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
	$scope.$watch('vm.topIndex', angular.bind(this, function(topIndex) {
          var scrollYear = Math.floor(topIndex / 1);
          self.selectedYear = scrollYear;
    }));
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

function DatePickerDir(){
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
	      	startDay:"@"
	    },
	    templateUrl:"date-picker.html",
		link : function(scope,element,att,ngModelCtrl){
			setViewMode(scope.mode)

			scope.currentDate = isNaN(ngModelCtrl.$viewValue)  ? moment().format(scope.format): ngModelCtrl.$modelValue ;

			ngModelCtrl.$viewChangeListeners.push(function() {
				scope.currentDate = ngModelCtrl.$modelValue;
			});

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

			scope.selectedDateTime = function(){
				var date = moment(scope.selectedDate,"MM-DD-YYYY");
				if(!date.isValid()){
					date = moment();
				}
				if(!angular.isUndefined(scope.selectedTime)){	
					var timeSplit = scope.selectedTime.split(':');
					date.hour(timeSplit[0]).minute(timeSplit[1]);
				}
				ngModelCtrl.$setViewValue(date.format(scope.format));
				ngModelCtrl.$render();
				setViewMode(scope.mode)
				scope.$emit('calender:close');			
			}

			scope.closeDateTime = function(){
				scope.$emit('calender:close');			
			}

			scope.$on('$destroy',function(){
			   element.remove();
			});
		}      
	}
}


var app = angular.module('smDateTimeRangePicker');

app.directive('smDatePicker',['$timeout',DatePickerDir]);


})();



(function(){

'use strict';

function RangePickerInput($document,$mdMedia,$mdUtil){
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
                +'      <input name="{{fname}}" ng-model="value" '
                +'             type="text" placeholde="{{lable}}"'
                +'             aria-label="{{fname}}" ng-required="{{isRequired}}" class="gj-input-container"'
                +'             ng-focus="show()">'
                +'    <sm-range-picker class="gj-calender-pane" ng-model="value" format="{{format}}" ></sm-range-picker>'
                +'  </md-input-container>',
      link :  function(scope,$element,attr){

        var inputPane = $element[0].querySelector('.gj-input-container');
        var calenderPane = $element[0].querySelector('.gj-calender-pane');
        var cElement = angular.element(calenderPane);
        
        scope.format = angular.isUndefined(scope.format) ? 'MM-DD-YYYY': scope.format;
        
        cElement.addClass('hide');

        scope.startDate  = angular.isUndefined(scope.value)? scope.startDate : scope.value;

        $document.on('click', function (e) {
            if ((calenderPane !== e.target && inputPane !==e.target) && (!calenderPane.contains(e.target) && !inputPane.contains(e.target))) {
              cElement.removeClass('show').addClass('hide');
              $mdUtil.enableScrolling();                                                  
            }
        });

        angular.element(inputPane).on('keydown', function (e) {
            if(e.which===9){
              cElement.removeClass('show').addClass('hide');
              angular.element(inputPane).focus();
              $mdUtil.enableScrolling();                                                  
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
            var top = elementRect.top - ((elementRect.top +calenderHeight) - (bodyRect.bottom -20));
          }
          var left = elementRect.left;
          if(elementRect.left +calenderWidth > bodyRect.right){
             left = elementRect.left - ((elementRect.left +calenderWidth) - (bodyRect.right -10));
          }
          return {top : top, left : left };
        }


        scope.$on('range-picker:close',function(){
            cElement.removeClass('show').addClass('hide');
            cElement.removeClass('show').addClass('hide');
            $mdUtil.enableScrolling();                                    
        });

        scope.$on('$destroy',function(){
          calenderPane.parentNode.removeChild(calenderPane);
        });

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
    controller: ['$scope',RangePickerCtrl],
    controllerAs : 'vm',
    templateUrl : 'range-picker.html',
    link : function(scope,element,att,ctrls){
      var ngModelCtrl = ctrls[0];
      var calCtrl = ctrls[1];
      calCtrl.configureNgModel(ngModelCtrl);

    }    
  }
}

var RangePickerCtrl = function($scope){
  var self = this;
  self.scope = $scope;
  self.clickedButton = 0;
  self.divider = angular.isUndefined(self.scope.divider)?" To ":self.scope.divider;
  self.format = 'MM-DD-YYYY';
  self.showCustom=false;
  self.startDate = moment().format(self.scope.format);
  self.endDate = moment().format(self.scope.format);
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
    self.showCustom=false;
}

RangePickerCtrl.prototype.preDefineDate = function(p){
    var self = this;  
    self.clickedButton=p;
    var instance = moment();
    switch (p){
      case 1:
        self.startDate = instance.clone().startOf('day').format(self.scope.format);
        self.endDate = instance.clone().endOf('day').format(self.scope.format);
        break;
      case 2:
        self.startDate = instance.clone().subtract(7,'d').format(self.scope.format);
        self.endDate = instance.clone().format(self.scope.format);
        break;
      case 3:
        self.startDate = instance.clone().startOf('month').format(self.scope.format);
        self.endDate = instance.endOf('month').format(self.scope.format);
        break;
      case 4:
        self.startDate = instance.clone().subtract(1,'month').startOf('month').format(self.scope.format);
        self.endDate = instance.clone().endOf('month').format(self.scope.format);
        break;
      case 5:
        self.startDate = instance.clone().startOf('quarter').format(self.scope.format);;
        self.endDate = instance.clone().endOf('quarter').format(self.scope.format);
        break;
      case 6:
        self.startDate = instance.clone().startOf('year').format(self.scope.format);;
        self.endDate = instance.clone().endOf('year').format(self.scope.format);
        break;
      case 7:
        self.showCustom=true;
        self.selectedTabIndex=0
        break;
      case 8:
        self.startDate = instance.clone().startOf('year').format(self.scope.format);;
        self.endDate = instance.clone().format(self.scope.format);
        break;
      default:
        break;
    }
    if(p!=7){
      self.setNgModelValue(self.startDate,self.divider,self.endDate);
      self.scope.$emit('range-picker:close');        
    }
} 

RangePickerCtrl.prototype.setNgModelValue = function(startDate,divider,endDate) {
    var self = this;
    self.scope.$emit('range-picker:close');
    self.ngModelCtrl.$setViewValue(startDate+' '+ divider +' '+endDate);
    self.ngModelCtrl.$render();
};

RangePickerCtrl.prototype.cancel = function(){
  var self = this;
  self.scope.$emit('range-picker:close');        
}

var app = angular.module('smDateTimeRangePicker');

app.directive('smRangePicker',['picker',smRangePicker]);
app.directive('smRangePickerInput',['$document','$mdMedia','$mdUtil',RangePickerInput]);

})();