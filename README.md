# SM Date, Time and Range Picker

Picker are design to be used with Angular Material.

  * for [Demo](http://mominsamir.github.io/smDateTimeRangePicker/)
  * [plunker](http://plnkr.co/edit/2ePb5nf8vH71iH5byP7q?p=preview) 

## Requirements
* [AngularJS](https://angularjs.org/)
* [Angular Material](https://material.angularjs.org/)
* [moment.js](http://momentjs.com/)
* [Material Design Font Icons](http://google.github.io/material-design-icons/#icon-font-for-the-web)

### Feature
* Anuglar Material Theme supported

### Screenshot 
* Date Picker

![Date Picker](https://raw.githubusercontent.com/mominsamir/date-time-picker/master/app/images/date-picker-1.png "Date Picker")
![Hour Picker](https://raw.githubusercontent.com/mominsamir/date-time-picker/master/app/images/date-picker-2.png "Date Picker")

 * Range Picker
  
![Range Default Picker](https://raw.githubusercontent.com/mominsamir/date-time-picker/master/app/images/range-picker-1.png "Range Picker")
![Range Custome Picker](https://raw.githubusercontent.com/mominsamir/date-time-picker/master/app/images/range-picker-2.png "Range Picker")
![Range Custome Picker](https://raw.githubusercontent.com/mominsamir/date-time-picker/master/app/images/range-picker-3.png "Range Picker")

### Installation
```sh
  bower install --save smDateTimeRangePicker
```
```sh
  angular.module('Your App',["ngMaterial","smDateTimeRangePicker"]); 
```

### Configuration

```sh
  angular.module('Your App',["ngMaterial","smDateTimeRangePicker"])
    .config(function ($mdThemingProvider,pickerProvider) {
        pickerProvider.setOkLabel('Save');    
        pickerProvider.setCancelLabel('Close');    
        //  Over ride day names by changing here
        pickerProvider.setDayHeader('single');  //Options 'single','shortName', 'fullName'
        picker.setDaysNames([
             {'single':'S','shortName':'Su','fullName':'Sunday'}, 
             {'single':'M','shortName':'Mo','fullName':'MonDay'}, 
             {'single':'T','shortName':'Tu','fullName':'TuesDay'}, 
             {'single':'W','shortName':'We','fullName':'Wednesday'}, 
             {'single':'T','shortName':'Th','fullName':'Thursday'}, 
             {'single':'F','shortName':'Fr','fullName':'Friday'}, 
             {'single':'S','shortName':'Sa','fullName':'Saturday'}
         ]);
         // Range Picker Configuration
         picker.setDivider('To');
         picker.setMonthNames(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
         picker.setRangeDefaultList(['Today',
                        'Last 7 Days',
                        'This Month',
                        'Last Month',
                        'This Quarter',
                        'Year To Date',
                        'This Year', 
                        'Custome Range']);
        picker.setRangeCustomStartEnd(['Start Date', 'End Date']);      
    }
```


####  DateTime Picker
```sh

      <div  layout="row"> 
            <sm-date-time-picker 
                fname="field" 
                lable="Date of Birth"
                form="empForm" 
                value="vm.employee.dateOfBirth" 
                flex="50"
                flex-sm="100"
                flex-xs="100"                          
                is-required="{{true}}" 
                format="MM-DD-YYYY HH:mm"
                mode="date-time" 
                week-start-day="Monday">
            </sm-date-time-picker>
    </div>
```
####  Date Picker
```sh

      <div  layout="row"> 
            <sm-date-time-picker 
                fname="field" 
                lable="Date of Birth"
                form="empForm" 
                value="vm.employee.dateOfBirth" 
                flex="50"
                flex-sm="100"
                flex-xs="100"                          
                is-required="{{true}}" 
                format="MM-DD-YYYY HH:mm"
                week-start-day="Monday">
            </sm-date-time-picker>
    </div>
```
####  Range Picker
```sh
	    <div layout="row">
	        <sm-range-picker-input
	                fname="dayOfPay" 
	                lable="Date of Pay"
	                form="empForm"
	                value="vm.employee.dateOfPay" 
	                flex="50"                         
	                is-required="{{true}}" 
	                format="MM-DD-YYYY"
	                mode="date-time" 
	                week-start-day="Sunday">
	        </sm-range-picker-input>
	    </div>
```



###License

The MIT License (MIT)

Copyright (c) 2015

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION  THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
