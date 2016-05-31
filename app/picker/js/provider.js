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

var app = angular.module('smDateTimeRangePicker');

app.provider('picker',[picker]);