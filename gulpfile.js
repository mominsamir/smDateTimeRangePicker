"use strict";

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    less = require('gulp-ruby-sass'),
    compass  = require('gulp-compass'),
    rename = require('gulp-rename'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),    
    plumber = require('gulp-plumber'),    
    autoprefixer = require('gulp-autoprefixer'),
    path = require('path'),
    clean = require('gulp-clean'),
    htmlToJs = require('gulp-html-to-js');


var outputFolder = 'dist/';
var moduleName = 'smDateTimeRangePicker';

var notifyInfo = {
    title: 'Gulp',
    icon: path.join(__dirname, 'gulp.png')
};

var plumberErrorHandler = { errorHandler: notify.onError({
        title: notifyInfo.title,
        icon: notifyInfo.icon,
        message: "Error: <%= error.message %>"
    })
};

//clean dist folder
gulp.task('clean', function () {
  return gulp.src('dist/*.*', {read: false})
    .pipe(clean());
})

//js minify task
gulp.task('script-uglify', function() {
    gulp.src('src/js/*.js')
        //.pipe(uglify())
        //.pipe(gulp.dest(outputFolder))        
        .pipe(concat({path: 'sm-picker-min.js'}))
        .pipe(gulp.dest(outputFolder));
});


//scss minify task
gulp.task('scss', function() {
    return gulp.src(['src/sass/date_picker.scss'])
        .pipe(plumber(plumberErrorHandler))
        .pipe(compass({
              config_file: './config.rb',
              sass: 'src/sass'
            }))
        .pipe(rename({  basename: "picker",
                        prefix: "sm-", 
                        suffix: '-min' }))        
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(outputFolder));
});


// With concatenation. 
// run only when template changes and update app run block manually.
gulp.task('htmlToString', function() {
  return gulp.src('src/template/*.html')
    .pipe(htmlToJs({concat: 'views.js'}))
    .pipe(gulp.dest(outputFolder));
});


gulp.task('default', ['clean','script-uglify','scss']);