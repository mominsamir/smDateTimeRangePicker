# SM Date, Time and Range Picker

Picker are design to be used with Angular Material.

- for [Demo](http://mominsamir.github.io/smDateTimeRangePicker/)
- [plunker](http://plnkr.co/edit/2ePb5nf8vH71iH5byP7q?p=preview)

## Requirements

- [AngularJS](https://angularjs.org/)
- [Angular Material](https://material.angularjs.org/)
- [moment.js](http://momentjs.com/)
- [Material Design Font Icons](http://google.github.io/material-design-icons/#icon-font-for-the-web)

## Features

- Angular Material Theme supported

### Date Picker

![Date Picker](https://raw.githubusercontent.com/mominsamir/date-time-picker/master/app/images/date-picker-1.png "Date Picker") ![Hour Picker](https://raw.githubusercontent.com/mominsamir/date-time-picker/master/app/images/date-picker-2.png "Date Picker")

### Range Picker

![Range Default Picker](https://raw.githubusercontent.com/mominsamir/date-time-picker/master/app/images/range-picker-1.png "Range Picker") ![Range Custome Picker](https://raw.githubusercontent.com/mominsamir/date-time-picker/master/app/images/range-picker-2.png "Range Picker")

## Usage

### Installation

```javascript
  npm install --save smdatetimerangepicker
```

```javascript
  bower install --save smDateTimeRangePicker
```

```javascript
  angular.module('Your App',["ngMaterial","smDateTimeRangePicker"]);
```

### Basic configuration

```javascript
  angular.module('Your App',["ngMaterial","smDateTimeRangePicker"])
    .config(function ($mdThemingProvider,pickerProvider) {
        pickerProvider.setOkLabel('Save');    
        pickerProvider.setCancelLabel('Close');    
        //  Over ride day names by changing here
        pickerProvider.setDayHeader('single');  //Options 'single','shortName', 'fullName'
    }
);
```

More options on [API documentation](http://mominsamir.github.io/smDateTimeRangePicker/).

### DateTime Picker

```html
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
        week-start-day="Monday"
    ></sm-date-time-picker>
</div>
```

More options on [API documentation](http://mominsamir.github.io/smDateTimeRangePicker/#!/date-time-picker-api).

### Date Picker

```html
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
        week-start-day="Monday"
    ></sm-date-time-picker>
</div>
```

More options on [API documentation](http://mominsamir.github.io/smDateTimeRangePicker/#!/date-time-picker-api).

### Range Picker

```html
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
            week-start-day="Sunday"
    ></sm-range-picker-input>
</div>
```

More options on [API documentation](http://mominsamir.github.io/smDateTimeRangePicker/#!/range-picker-api).

## Contributing to the project

We are always looking for the quality contributions! Please check the [contribution docs](CONTRIBUTING.md) for the contribution instructions.
