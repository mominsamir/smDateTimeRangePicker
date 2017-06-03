/* global moment */
function picker(){
    var massagePath = 'X';
    var cancelLabel = 'Cancel';
    var okLabel = 'Ok';
    var clearLabel = 'Clear';
    var customRangeLabel = 'Custom Range';
    var format = 'MM-DD-YYYY';
    var customHeader ={
        date:'ddd, MMM DD',
        dateTime:'ddd, MMM DD HH:mm',
        time:'HH:mm',
    }

    //date picker configuration
    var daysNames = [
        {'single':'S', 'shortName':'Su', 'fullName':'Su startDate:nday'},
        {'single':'M', 'shortName':'Mo', 'fullName':'MonDay'},
        {'single':'T', 'shortName':'Tu', 'fullName':'TuesDay'},
        {'single':'W', 'shortName':'We', 'fullName':'Wednesday'},
        {'single':'T', 'shortName':'Th', 'fullName':'Thursday'},
        {'single':'F', 'shortName':'Fr', 'fullName':'Friday'},
        {'single':'S', 'shortName':'Sa', 'fullName':'Saturday'}
    ];

    var colorIntention = 'md-primary';    

    var dayHeader = 'single';

    var monthNames = moment.months();

    //range picker configuration
    var rangeDivider = 'To';
    var rangeDefaultList = [
        {
            label:'Today',
            startDate:moment().utc().startOf('day'),
            endDate:moment().utc().endOf('day')
        },
        {
            label:'Last 7 Days',
            startDate: moment().utc().subtract(7, 'd').startOf('day'),
            endDate:moment().utc().endOf('day')
        },
        {
            label:'This Month',
            startDate:moment().utc().startOf('month'),
            endDate: moment().utc().endOf('month')
        },
        {
            label:'Last Month',
            startDate:moment().utc().subtract(1, 'month').startOf('month'),
            endDate: moment().utc().subtract(1, 'month').endOf('month')
        },
        {
            label: 'This Quarter',
            startDate: moment().utc().startOf('quarter'),
            endDate: moment().utc().endOf('quarter')
        },
        {
            label:  'Year To Date',
            startDate:  moment().utc().startOf('year'),
            endDate:  moment().utc().endOf('day')
        },
        {
            label:  'This Year',
            startDate:  moment().utc().startOf('year'),
            endDate:  moment().utc().endOf('year')
        }
    ];

    var rangeCustomStartEnd =['Start Date', 'End Date'];


    return {
        setMassagePath : function(param){
            massagePath = param;
        },
        setDivider : function(value) {
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
        setClearLabel : function(param){
            clearLabel = param;
        },
        setCustomRangeLabel : function(param){
            customRangeLabel = param;
        },
        setRangeDefaultList : function(array){
            rangeDefaultList = array;
        },
        setRangeCustomStartEnd : function(array){
            rangeCustomStartEnd = array;
        },
        setColorIntention : function(theme){
            colorIntention = theme;
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
                clearLabel : clearLabel,
                customRangeLabel: customRangeLabel,

                daysNames : daysNames,
                monthNames:monthNames,
                dayHeader :dayHeader,
                customHeader:customHeader,

                rangeDivider : rangeDivider,
                rangeCustomStartEnd : rangeCustomStartEnd,
                rangeDefaultList :rangeDefaultList,
                format : format,
                colorIntention :colorIntention
            }
        }
    }
}

var app = angular.module('smDateTimeRangePicker');
app.provider('picker', [picker]);
