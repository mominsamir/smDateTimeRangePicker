var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var addStream = require('add-stream'); 
var templateCache = require('gulp-angular-templatecache');

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


gulp.task('html', function () {
  gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist/'))
    .pipe(connect.reload())
});


gulp.task('copyjs', function () {
  gulp.src('app/**/*.js')
    .pipe(gulp.dest('dist/'))
    .pipe(connect.reload());
});



gulp.task('styles', function() {
   gulp.src('app/styles/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('dist/styles/'))
    	.pipe(connect.reload());
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
gulp.task('default',['clean','copyjs','html','styles','watch','connect']);

gulp.task('build',['cleanSrc','pickerJs','stylePicker']);
 
