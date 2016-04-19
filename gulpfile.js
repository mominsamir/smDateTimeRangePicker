var gulp = require('gulp'),
 sass = require('gulp-sass'),
 connect = require('gulp-connect'),
 watch = require('gulp-watch'),
 clean = require('gulp-clean'),
 concat = require('gulp-concat'),
 rename = require('gulp-rename'),
 addStream = require('add-stream'),
 templateCache = require('gulp-angular-templatecache'),
 wiredep = require('wiredep').stream,
 replaceName = require('gulp-html-replace'),
 mainBowerFiles = require('main-bower-files'),
 order = require("gulp-order");

var appConfig = {
    app:  'app',
    dist: 'dist',
    src : 'src'
};


gulp.task('connect', function () {
  connect.server({
    root: 'dist',
    port: 8080,
    livereload: true,
	  middleware: function (connect) {
      return [connect().use("/bower_components", connect.static("bower_components"))];
    }    
  });
});

/*
  not required as of now
*/
gulp.task('inject',function(){
  var options = {
    bowerJson :require("./bower.json"),
    directory : '/bower_components'
  }

 return gulp.src('app/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('dist/'));
})


 gulp.task('replaceName', function() {
      gulp.src('app/index.html')
        .pipe(gulp.dest('dist/'));
});


gulp.task('html', function () {
  gulp.src('app/**/*.html')
    .pipe(replaceName({
            'css': ['styles/vendor.min.css','styles/picker.min.css'],
            'js': ['scripts/vendor.min.js','scripts/script.min.js']
    }))
    .pipe(gulp.dest('dist/'))    
    .pipe(connect.reload())
});


gulp.task('copyjs', function () {
  gulp.src([
        'app/scripts/app.js',
        'app/scripts/**/*.js',
        'app/picker/**/*.js',
        'app/menu/**/*.js',                        
      ])
     //.pipe(order())
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(connect.reload());
});

gulp.task('vendorJs', function(){  
  gulp.src(mainBowerFiles('**/*.js'))
//  .pipe(uglify())
  .pipe(concat('vendor.min.js'))
  .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('styles', function() {
   gulp.src('app/styles/*.scss')
      .pipe(sass())
      .pipe(concat('picker.min.css'))
      .pipe(gulp.dest('dist/styles/'))
    	.pipe(connect.reload());
});

gulp.task('vendorCss', function(){  
  gulp.src(mainBowerFiles('**/*.css'))
//  .pipe(uglify())
  .pipe(concat('vendor.min.css'))
  .pipe(gulp.dest('dist/styles/'));
});

gulp.task('watch', function() {
    gulp.watch('app/**/*.html',['html']);
    gulp.watch('app/**/*.js',['copyjs']);
    gulp.watch('app/styles/*.scss',['styles']);        
});

gulp.task('clean',function(){
return gulp.src('dist/*', {read: false})
		.pipe(clean());
})








/*

  buid task for distribution

*/

function prepareTemplates() {
  return gulp.src('app/picker/*.html')
    .pipe(templateCache(
      {
        module:'smDateTimeRangePicker',
        transformUrl: function(url) {
          console.log('picker/'+url);
          return 'picker/'+url;
        }
  }));
}





gulp.task('stylePicker', function() {
   gulp.src('app/styles/date_picker.scss')
      .pipe(sass())
      .pipe(rename('picker.css'))
      .pipe(gulp.dest('src/'));
});


gulp.task('pickerJs', function () {
  gulp.src('app/picker/*.js')
    .pipe(addStream.obj(prepareTemplates()))
    .pipe(concat('picker.js'))
    .pipe(gulp.dest('src/'));
});


gulp.task('cleanSrc',function(){
return gulp.src('src/*', {read: false})
    .pipe(clean());
})


//Watch task
gulp.task('default',['clean','copyjs','vendorJs','html','styles','vendorCss','watch','connect']);

gulp.task('build',['cleanSrc','pickerJs','stylePicker']);
 
