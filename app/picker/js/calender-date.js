(function(){

'use strict';

function Calender($timeout,picker){
    
	return {
	  restrict : 'E',
	  replace:true,
      require: ['^ngModel', 'smCalender'],
      scope :{
	      	minDate: "=",
	      	maxDate: "=",
	      	initialDate : "=",
	      	format: '@',
	      	mode: '@',
	      	startView:'@',	      	
	      	weekStartDay:'@',
	      	disableYearSelection:'@',
	      	dateSelectCall : '&'
	    },
	   	controller:["$scope","$timeout","picker","$mdMedia",CalenderCtrl],
	    controllerAs : 'vm',
	    templateUrl:"picker/calender-date.html",
		link : function(scope,element,attr,ctrls){

			var ngModelCtrl = ctrls[0];
	        var calCtrl = ctrls[1];
	        calCtrl.configureNgModel(ngModelCtrl);
		}      
	}
}

var CalenderCtrl = function($scope,$timeout,picker,$mdMedia){
	var self  = this;

	self.$scope = $scope;
	self.$timeout = $timeout;
    self.picker = picker;
    self.dayHeader = self.picker.dayHeader;
	self.initialDate = $scope.initialDate; 	
    self.viewModeSmall = $mdMedia('xs');
	self.startDay = angular.isUndefined($scope.weekStartDay) || $scope.weekStartDay==='' ? 'Sunday' : $scope.weekStartDay ;	   	
	self.minDate = $scope.minDate;			//Minimum date 
	self.maxDate = $scope.maxDate;			//Maximum date 
	self.mode = angular.isUndefined($scope.mode) ? 'DATE' : $scope.mode;
	self.format = $scope.format;
	self.restrictToMinDate = angular.isUndefined($scope.minDate) ? false : true;
	self.restrictToMaxDate = angular.isUndefined($scope.maxDate) ? false : true;
	self.stopScrollPrevious =false;
	self.stopScrollNext = false;
	self.disableYearSelection = $scope.disableYearSelection;
	self.monthCells=[];
	self.dateCellHeader= [];	
	self.dateCells = [];
	self.monthList = picker.monthNames;
	self.moveCalenderAnimation='';

	self.format = angular.isUndefined(self.format) ? 'MM-DD-YYYY': self.format;
	self.initialDate =	angular.isUndefined(self.initialDate) ? moment() : moment(self.initialDate,self.format);
	
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

CalenderCtrl.prototype.setInitDate = function(dt) {
    var self = this;
    console.log(dt);
    self.initialDate =angular.isUndefined( dt) ? moment() : moment( dt,self.format);
  };


CalenderCtrl.prototype.configureNgModel = function(ngModelCtrl) {
    var self = this;

    self.ngModelCtrl = ngModelCtrl;

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
	self.buildDateCells();
	self.buildDateCellHeader();
	self.buildMonthCells();
	self.setView()
    self.showYear();


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
	self.$scope.dateSelectCall({date:d});
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
	if(self.disableYearSelection){
		return;
	}else{ 
	    if(view==='YEAR_MONTH'){
	   		self.showYear();
    	}
   		self.view =view;
	}
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




function picker(){
    var massagePath = "X";
    var cancelLabel = "Cancel";
    var okLabel = "Ok";
    var customHeader ={
        date:'ddd, MMM DD',
        dateTime:'ddd, MMM DD HH:mm',
        time:'HH:mm',
    }


    //date picker configuration
    var daysNames =  [
        {'single':'S','shortName':'Su','fullName':'Su startDate:nday'}, 
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
    var rangeDefaultList = [
    		{	label:'Today',
    			startDate:moment().startOf('day'),
    			endDate:moment().endOf('day')
    		},
            {	label:'Last 7 Days',
            	startDate: moment().subtract(7,'d'),
            	endDate:moment()
            },
            {	
            	label:'This Month',
            	startDate:moment().startOf('month'), 
            	endDate: moment().endOf('month')
            },
            {
				label:'Last Month',
				startDate:moment().subtract(1,'month').startOf('month'),
				endDate: moment()
			},
            {
				label: 'This Quarter',
				startDate: moment().startOf('quarter'),
            	endDate: moment().endOf('quarter')
            },
            {
				label:  'Year To Date',
				startDate:  moment().startOf('year'),
            	endDate:  moment()
            },
            {
            	label:  'This Year',
				startDate:  moment().startOf('year'),
            	endDate:  moment().endOf('year')
            }/*, 
            { 
				label:  'Custom Range',
				startDate:  'custom',
				endDate: 'custom'
			}*/
		];

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
        setCustomHeader : function(obj){
            if(!angular.isUndefined(obj.date)){
                customHeader.date= obj.date;
            }
            if(!angular.isUndefined(obj.dateTime)){
                customHeader.dateTime= obj.dateTime;
            }
            if(!angular.isUndefined(obj.time)){
                customHeader.time= obj.time;
            }                        
        },               
		$get: function(){
			return {
				massagePath : massagePath,
                cancelLabel: cancelLabel,
                okLabel : okLabel,

                daysNames : daysNames,
                monthNames:monthNames,
                dayHeader :dayHeader,
                customHeader:customHeader,

                rangeDivider : rangeDivider,
                rangeCustomStartEnd : rangeCustomStartEnd,
                rangeDefaultList :rangeDefaultList                 
			}
		}
	}
}

var app = angular.module('smDateTimeRangePicker',[]);

app.directive('smCalender',['$timeout','picker',Calender]);
app.provider('picker',[picker]);

})();