/* global require */
var gulp = require('gulp'),
sass = require('gulp-sass'),
connect = require('gulp-connect'),
clean = require('del'),
concat = require('gulp-concat'),
rename = require('gulp-rename'),
addStream = require('add-stream'),
templateCache = require('gulp-angular-templatecache'),
replaceName = require('gulp-html-replace'),
mainBowerFiles = require('main-bower-files');

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
            return [connect().use('/bower_components', connect.static('bower_components'))];
        }
    });
});

gulp.task('replaceName', function() {
    gulp.src('app/index.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('html', function () {
    gulp.src('app/**/*.html')
    .pipe(replaceName({
        'css': ['styles/vendor.min.css', 'styles/picker.min.css'],
        'js': ['scripts/vendor.min.js', 'scripts/script.min.js']
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


gulp.task('styles', function() {
    gulp.src('app/styles/*.scss')
    .pipe(sass())
    .pipe(concat('picker.min.css'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(connect.reload());
});

// build vendor js and styles
gulp.task('vendorJs', function(){
    gulp.src(mainBowerFiles('**/*.js'))
    //  .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('vendorCss', function(){
    gulp.src(mainBowerFiles('**/*.css'))
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest('dist/styles/'));

});

// watch task
gulp.task('watch', function() {
    gulp.watch('app/**/*.html', ['html']);
    gulp.watch('app/**/*.js', ['copyjs']);
    gulp.watch('app/styles/*.scss', ['styles']);
});

// clean task
gulp.task('clean', function() {
    return clean(['dist/*']);
});


/*
buid task for distribution
*/
function prepareTemplates() {
    return gulp.src('app/picker/*.html')
    .pipe(templateCache({
        module:'smDateTimeRangePicker',
        transformUrl: function(url) {
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
    // solution via https://github.com/auth0/angular-storage
    gulp.src(['app/picker/js/picker.prefix', 'app/picker/js/*.js', 'app/picker/js/picker.suffix'])
    .pipe(addStream.obj(prepareTemplates()))
    .pipe(concat('picker.js'))
    .pipe(gulp.dest('src/'));
});

gulp.task('cleanSrc', function() {
    return clean(['src/']);
});

//Watch task
gulp.task('default', ['clean', 'html', 'vendorCss', 'vendorJs', 'styles', 'copyjs', 'watch', 'connect']);
gulp.task('serve', ['default']);
gulp.task('build', ['cleanSrc', 'pickerJs', 'stylePicker']);
