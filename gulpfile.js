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
    connect = require('gulp-connect')    ,
    htmlToJs = require('gulp-html-to-js'),
    watch = require('gulp-watch');


var basePath ={
    index : "/demo/index.html",
    demo_js : "demo/scripts/**/*.js"
}



gulp.task('connect', function () {
  connect.server({
    root: '/demo',
    port: 8888
  });
});


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

function demoScss() {
    return function(){ gulp.src(['demo/styles/*.scss'])
        .pipe(plumber(plumberErrorHandler))
        .pipe(compass({
              config_file: './config.rb',
              sass: 'demo/styles'
            }))
        //.pipe(rename({ basename: "main"}))        
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('demo/styles/'));
    }
}

//scss minify task
gulp.task('demo-scss', demoScss());


//scss minify task
gulp.task('scss', function() {
    return gulp.src(['src/sass/*.scss',])
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


gulp.task('watch',function(){
    return gulp.watch(['demo/styles/*.scss'],['demo-scss']);

});



gulp.task('default', ['clean','script-uglify','scss']);

gulp.task('start',
  ['demo-scss', 'connect','watch']
);