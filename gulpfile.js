/* ---- INCLUDES PACKAGES ---- */

var gulp = require('gulp'),
    browserSync = require('browser-sync'),						// Keep multiple browser & devices in sync..
    sass = require('gulp-sass'),											// Plugin to able use the SASS & SCSS syntac..
    uglify = require('gulp-uglify'),									// Compress the Javascript..
    concat = require('gulp-concat'),									// Combine files into a new file..
    header = require('gulp-header'),									// Create a header above the files..
    rename = require('gulp-rename'),									// Rename a document..
    minifyCSS = require('gulp-minify-css'),						// Compress your CSS..
		package = require('./package.json'),							// Specify your dependencies..
		file = require('gulp-file'),											//
    fileinclude = require('gulp-file-include'),				// Include components into html files..
    svgmin = require('gulp-svgmin'),									// Compress SVG items..
		image = require('gulp-image'),										// Compress images
		raster = require('gulp-raster'),									// Scale images for high resolution..
    run = require("gulp-run"),												// Plugin to be able to run commands in gulp..
    ftp = require('gulp-ftp'),												// Upload files to FTP..
    autoprefixer = require("gulp-autoprefixer");			// Create prefix voor CSS elements..


/* ---- SIGNATURE VARIABLE ---- */
var banner = [
	'/*!\n' +
	' * <%= package.name %>\n' +
	' * <%= package.title %>\n' +
	' * <%= package.url %>\n' +
	' * @author <%= package.author %>\n' +
	' * @version <%= package.version %>\n' +
	' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
	' */',
	'\n'
].join('');


/* ---- HTML TASKS ---- */
gulp.task('html', function () {
    return gulp.src([
        'app/**/*.html',
        '!app/html-components/**',
				'!app/kentico-components/**'
    ])

    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file',
        indent: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true, once: true }));
});


/* ---- SASS TASKS ---- */
gulp.task('sass', function () {
  	return gulp.src([
				'app/assets/sass/main.scss'
  	])
  	.pipe(sass({
    		errLogToConsole: true,
    		sourceComments: false
  	}))
  	.pipe(autoprefixer({
	  		browsers: ['last 2 versions', 'ie 9'],
    		cascade: false
  	}))
  	.pipe(header(banner, { package: package }))
  	.pipe(gulp.dest('dist/assets/css'))
  	.pipe(gulp.dest('assets/css')) 											// Create Assets folder for Kentico
  	.pipe(minifyCSS({
  			removeDuplicates: true,
    		keepSpecialComments: 0
  	}))
  	.pipe(header(banner, { package: package }))
  	.pipe(rename({ suffix: ".min" }))
  	.pipe(gulp.dest('dist/assets/css'))
  	.pipe(gulp.dest('assets/css'))
  	.pipe(browserSync.reload({ stream: true, once: false }));
});


/* ---- JAVASCRIPT TASKS ---- */
gulp.task('js', function () {
    return gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'app/assets/js/libraries/selectize.js',
        'app/assets/js/master.js'
    ])
   .pipe(concat('main.js'))
   .pipe(header(banner, { package: package }))
   .pipe(gulp.dest('dist/assets/js'))
   .pipe(gulp.dest('assets/js'))
   .pipe(uglify())
   .pipe(header(banner, { package: package }))
   .pipe(rename({ suffix: '.min' }))
   .pipe(gulp.dest('dist/assets/js'))
   .pipe(gulp.dest('assets/js'))
   .pipe(browserSync.reload({ stream: true, once: true }));
});


/* ---- FONTS TASKS ---- */
gulp.task('fonts', function () {
    return gulp.src('app/assets/fonts/**/*')
        .pipe(gulp.dest('dist/assets/fonts/'))
        .pipe(gulp.dest('assets/fonts/'))
        .pipe(browserSync.reload({ stream: true, once: true }));
});


/* ---- SVG TASKS ---- */
gulp.task('svg', function () {
    return gulp.src('app/assets/img/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(gulp.dest('assets/img'))
        .pipe(raster())
        .pipe(rename({ extname: '.png' }))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(browserSync.reload({ stream: true, once: true }));
});

/* ---- IMAGES TASKS ---- */
gulp.task('image', function () {
    return gulp.src([
            'app/assets/img/**/*.gif',
            'app/assets/img/**/*.png',
            'app/assets/img/**/*.jpg'
    ])
				.pipe(image())
        .pipe(gulp.dest('dist/assets/img/'))
        .pipe(gulp.dest('assets/img/'))
        .pipe(browserSync.reload({ stream: true, once: true }));
});

/* ---- VIDEO TASKS ---- */
gulp.task('video', function () {
    return gulp.src([
            'app/assets/video/*'
    ])
        .pipe(gulp.dest('dist/assets/video/'))
        .pipe(gulp.dest('assets/video/'))
        .pipe(browserSync.reload({ stream: true, once: true }));
});

/* ---- FAVICON TASKS ---- */
gulp.task('favicon', function () {
    return gulp.src('app/assets/*.ico')
        .pipe(gulp.dest('dist/assets/'))
        .pipe(gulp.dest('assets/'))
        .pipe(browserSync.reload({ stream: true, once: true }));
});

/* ---- BROWSER SYNC ---- */
gulp.task('browser-sync', function () {
    browserSync.init(null, {
        server: {
            baseDir: "dist"
        }
    });
});

/* ---- REMOVE READONLY ---- */
gulp.task('remove-readonly', function () {
    var isWindows = process.platform === "win32" ? true : false;
    if (isWindows) {
        run("if exist assets\ rd /Q /S assets").exec();
        run("if exist dist\ rd /Q /S dist").exec();
        run("attrib -r app\\*.* /s").exec();
    } else {
        run("chmod -R 777 app").exec();
    }
});


/* ---- DEFAULT TASKS ---- */
gulp.task('default', ['remove-readonly', 'js', 'html', 'sass', 'favicon', 'fonts', 'image', 'svg', 'video', 'browser-sync'], function () {
    gulp.watch("app/assets/fonts/*", ['fonts']);
    gulp.watch("app/assets/img/**", ['image', 'svg']);
    gulp.watch("app/assets/sass/**/*.scss", ['sass']);
    gulp.watch("app/assets/video/*", ['video']);
    gulp.watch("app/assets/js/**/*.js", ['js', 'test-js']);
    gulp.watch("app/**/*.html", ['html']);
});


/* ---- DEPLOY KENTICO ---- */
gulp.task('build', ['remove-readonly', 'js', 'html', 'sass', 'favicon', 'fonts', 'image', 'svg', 'video']);


/* ---- DEPLOY FRONTEND ---- */
gulp.task('deploy', function(){
    return gulp.src( 'dist/**' )

        .pipe(ftp({
            host: 'iblhosting-websrv07.cloudapp.net',
            user: 'ftptlfrontend',
            pass: 'cEuO3BkWFZlX',
            remotePath: 'ftptlfrontend/' + package.name
        }))
        .pipe(gutil.noop());
});
