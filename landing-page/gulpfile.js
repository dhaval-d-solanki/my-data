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

// Main Files
var CORE_JS = ['/js/core/jquery-3.5.1.slim.min.js', '/js/core/popper.min.js', '/js/core/bootstrap.min.js'];
var JS = ['/js/main/main.js', '/js/main/grandparent.js', '/js/main/parent.js'];
var CORE_CSS = ['/css/core/bootstrap.min.css'];
var CSS = ['/css/other/other.css'];


// JS
var SRC_CORE_JS = CORE_JS.map(ele => 'src'+ele);
var TMP_CORE_JS = CORE_JS.map(ele => 'tmp'+ele);
var SRC_JS = JS.map(ele => 'src'+ele);
var TMP_JS = JS.map(ele => 'tmp'+ele);

// CSS
var SRC_CORE_CSS = CORE_CSS.map(ele => 'src'+ele);
var TMP_CORE_CSS = CORE_CSS.map(ele => 'tmp'+ele);
var SRC_CSS = CSS.map(ele => 'src'+ele);
var TMP_CSS = CSS.map(ele => 'tmp'+ele);

// SCSS
var SRC_MAIN_SCSS = ['src/scss/main.scss'];

/* var SRC_CORE_JS = ['src/js/core/jquery.js', 'src/js/core/popper.min.js', 'src/js/core/bootstrap.min.js'];
var TMP_CORE_JS = ['tmp/js/core/jquery.js', 'tmp/js/core/popper.min.js', 'tmp/js/core/bootstrap.min.js'];
var SRC_JS = ['src/js/main/main.js', 'src/js/main/grandparent.js', 'src/js/main/parent.js'];
var TMP_JS = ['tmp/js/main/main.js', 'tmp/js/main/grandparent.js', 'tmp/js/main/parent.js']; */
/* var SRC_CORE_CSS = ['src/css/core/bootstrap.min.css'];
var TMP_CORE_CSS = ['tmp/css/core/bootstrap.min.css'];
var SRC_CSS = ['src/css/other/other.css'];
var TMP_CSS = ['tmp/css/other/other.css']; */


var paths = {
  src: 'src/**/*',
  srcHTML: 'src/**/*.html',
  srcCSSCore: SRC_CORE_CSS,
  srcCSS: SRC_CSS,
  srcSCSS: SRC_MAIN_SCSS,
  srcJSCore: SRC_CORE_JS,
  srcJS: SRC_JS,
  tmp: 'tmp',
  tmpCSSCoreFolder: 'tmp/css/core',
  tmpCSSFolder: 'tmp/css/other',
  tmpSCSSFolder: 'tmp/css',
  tmpJSFolder: 'tmp/js/main',
  tmpJSCoreFolder: 'tmp/js/core',
  tmpIndex: 'tmp/index.html',
  tmpCSSCore: TMP_CORE_CSS,
  tmpCSS: TMP_CSS,
  tmpSCSS: ['tmp/css/main.css'],
  tmpJSCore: TMP_CORE_JS,
  tmpJS: TMP_JS,
  dist: 'dist',
  distCSSFolder: 'dist/css',
  distCSSCoreFolder: 'dist/css/core',
  distCSSOtherFolder: 'dist/css/other',
  distJSCoreFolder: 'dist/js/core',
  distJSFolder: 'dist/js/main',
  distIndex: 'dist/index.html',
  distCoreCSS: 'dist/css/core/core.min.css',
  distOtherCSS: 'dist/css/other/other.min.css',
  distMainCSS: 'dist/css/main.min.css',
  distCSS: 'dist/**/*.css',
  distJSCore: ['dist/js/core/core.min.js'],
  distJS: ['dist/js/main/main.min.js']
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
		//.pipe(rename('main.min.css'))
        //.pipe(gulp.dest(paths.srcCSS))
		.pipe(sass())
		.pipe(rename('main.css'))
        .pipe(gulp.dest(paths.tmpSCSSFolder));
});

gulp.task('css:core', function () {
  return gulp.src(paths.srcCSSCore).pipe(gulp.dest(paths.tmpCSSCoreFolder));
});

gulp.task('css:other', function () {
  return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmpCSSFolder));
});

gulp.task('jsCore', function () {
  return gulp.src(paths.srcJSCore).pipe(gulp.dest(paths.tmpJSCoreFolder));
});

gulp.task('js', function () {
  return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmpJSFolder));
});


gulp.task('copy', ['html', 'css:core', 'css:other', 'sass', 'jsCore', 'js']);
//END SET 1

//START SET 2
//added the ‘copy’ task as a dependency for the 'inject'
gulp.task('inject', ['copy'], function () {
  var cssCore = gulp.src(paths.tmpCSSCore, {read: false});
  var otherCss = gulp.src(paths.tmpCSS, {read: false});
  var scssMain = gulp.src(paths.tmpSCSS, {read: false});
  var jsCore = gulp.src(paths.tmpJSCore, {read: false});
  var mainJs = gulp.src(paths.tmpJS, {read: false});
  return gulp.src(paths.tmpIndex)
    .pipe(inject( cssCore, { relative:true, name: 'headcss' } ))
    .pipe(inject( otherCss, { relative:true, name: 'othercss' } ))
    .pipe(inject( scssMain, { relative:true, name: 'mainscss' } ))
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

gulp.task('css:dist:core', function () {
  return gulp.src(paths.srcCSSCore)
    .pipe(concat('core.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.distCSSCoreFolder));
});

gulp.task('css:dist:other', function () {
  return gulp.src(paths.srcCSS)
    .pipe(concat('other.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.distCSSOtherFolder));
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
	.pipe(rename('main.min.css'))
    .pipe(gulp.dest(paths.distCSSFolder))
	.pipe(sass())
	.pipe(rename('main.css'))
	.pipe(gulp.dest(paths.distCSSFolder));
});

gulp.task('js:core:dist', function () {
  return gulp.src(paths.srcJSCore)
    .pipe(concat('core.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.distJSCoreFolder));
});

gulp.task('js:dist', function () {
  return gulp.src(paths.srcJS)
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.distJSFolder));
});

gulp.task('copy:dist', ['html:dist','css:dist:core', 'css:dist:other', 'sass:dist', 'js:core:dist', 'js:dist']);

gulp.task('inject:dist', ['copy:dist'], function () {
  var cssCore = gulp.src(paths.distCoreCSS);
  var cssOther = gulp.src(paths.distOtherCSS);
  var cssMain = gulp.src(paths.distMainCSS);
  var jsCore = gulp.src(paths.distJSCore, {read: false});
  var jsMain = gulp.src(paths.distJS);
  return gulp.src(paths.distIndex)
    .pipe(inject( cssCore, { relative:true, name: 'headcss' } ))
    .pipe(inject( cssOther, { relative:true, name: 'othercss' } ))
    .pipe(inject( cssMain, { relative:true, name: 'mainscss' } ))
    .pipe(inject( jsCore, { relative:true, name: 'head' } ))
    .pipe(inject( jsMain, { relative:true, name: 'main' } ))
    .pipe(gulp.dest(paths.dist));
});
gulp.task('build', ['inject:dist']);
//END SET 3