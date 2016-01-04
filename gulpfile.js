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
    clean = require('gulp-clean');


var outputFolder = 'dist/';
var moduleName = 'dateTimePicker';

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
        .pipe(gulp.dest(outputFolder))        
        .pipe(concat({path: 'sm-picker-min.js'}))
        .pipe(gulp.dest(outputFolder));
});


//scss minify task
gulp.task('scss', function() {
    return gulp.src(['src/sass/*.scss'])
        .pipe(plumber(plumberErrorHandler))
        .pipe(compass({
              config_file: './config.rb',
              css: outputFolder,
              sass: 'src/sass'
            }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({  basename: "picker",
                        prefix: "sm-", 
                        suffix: '-min' }))
        .pipe(gulp.dest(outputFolder));
});

/*gulp.task('copy-html', function () {
  return gulp
    .src('src/html/*.html')
    .pipe(gulp.dest(outputFolder))
})*/

gulp.task('default', ['clean','script-uglify','scss']);