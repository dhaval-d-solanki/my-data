var gulp = require('gulp');
var inject = require('gulp-inject');
var webserver = require('gulp-webserver');
var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var sass        = require('gulp-sass');
var concat = require('gulp-concat');
var rename 		= require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');

var paths = {
  src: 'src/**/*',
  srcHTML: 'src/**/*.html',
  srcCSS: 'src/**/*.css',
  srcSCSS: 'src/scss/styles.scss',
  srcJSCore: ['src/js/core/jquery.js', 'src/js/core/bootstrap.js'],
  srcJS: ['src/js/main/main.js', 'src/js/main/grandparent.js', 'src/js/main/parent.js'],
  tmp: 'tmp',
  tmpIndex: 'tmp/index.html',
  tmpCSS: 'tmp/**/*.css',
  tmpJSCore: ['tmp/js/core/jquery.js', 'tmp/js/core/bootstrap.js'],
  tmpJS: ['tmp/js/main/main.js', 'tmp/js/main/grandparent.js', 'tmp/js/main/parent.js'],
  dist: 'dist',
  distIndex: 'dist/index.html',
  distCSS: 'dist/**/*.css',
  distJSCore: ['dist/script.core.min.js'],
  distJS: ['dist/script.main.min.js']
};
// Specifying the /**/* part is equivalent to including all files within the folder and any possible subfolders.

// START: SET 1
gulp.task('html', function () {
  return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(paths.srcSCSS)
        //.pipe(sass({outputStyle: 'compressed'}))
		//.pipe(rename('styles.min.css'))
        //.pipe(gulp.dest(paths.srcCSS))
		.pipe(sass())
		.pipe(rename('styles.css'))
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('css', function () {
  return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});

gulp.task('js', function () {
  return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});


gulp.task('copy', ['html', 'sass', 'js']);
//END SET 1

//START SET 2
//added the ‘copy’ task as a dependency for the 'inject'
gulp.task('inject', ['copy'], function () {
  var css = gulp.src(paths.tmpCSS, {read: false});
  var jsCore = gulp.src(paths.tmpJSCore, {read: false});
  var mainJs = gulp.src(paths.tmpJS, {read: false});
  return gulp.src(paths.tmpIndex)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( jsCore, { relative:true, name: 'head' } ))
    .pipe(inject( mainJs, { relative:true, name: 'main' } ))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('serve', ['inject'], function () {
  return gulp.src(paths.tmp)
    .pipe(webserver({
      port: 3000,
      livereload: true,
      open: true
    }));
});

gulp.task('watch', ['serve'], function () {
  gulp.watch(paths.src, ['inject']);
});
//END SET 2

gulp.task('default', ['watch']);
gulp.task('clean', function () {
  del([paths.tmp, paths.dist]);
});

//START SET 3
gulp.task('html:dist', function () {
  return gulp.src(paths.srcHTML)
    // .pipe(htmlclean())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('css:dist', function () {
  return gulp.src(paths.srcCSS)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('sass:dist', function () {
  return gulp.src(paths.srcSCSS)
    .pipe(sass({outputStyle: 'compressed'}))
	.pipe(rename('styles.min.css'))
    .pipe(gulp.dest(paths.dist))
	.pipe(sass())
	.pipe(rename('styles.css'))
	.pipe(gulp.dest(paths.dist));
});

gulp.task('js:core:dist', function () {
  return gulp.src(paths.srcJSCore)
    .pipe(concat('script.core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('js:dist', function () {
  return gulp.src(paths.srcJS)
    .pipe(concat('script.main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('copy:dist', ['html:dist', 'sass:dist', 'js:core:dist', 'js:dist']);

gulp.task('inject:dist', ['copy:dist'], function () {
  var css = gulp.src(paths.distCSS);
  var jsCore = gulp.src(paths.distJSCore, {read: false});
  var jsMain = gulp.src(paths.distJS);
  return gulp.src(paths.distIndex)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( jsCore, { relative:true, name: 'head' } ))
    .pipe(inject( jsMain, { relative:true, name: 'main' } ))
    .pipe(gulp.dest(paths.dist));
});
gulp.task('build', ['inject:dist']);
//END SET 3