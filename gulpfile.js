var gulp = require('gulp');
var react = require('gulp-react');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('streamify');
var uglify = require('gulp-uglify');
var del = require('del');
var imagemin = require('gulp-imagemin');
var cleanCss = require('gulp-clean-css');
var replace = require('gulp-replace');
var transform = require('vinyl-transform');
var runSequence = require('run-sequence');

var bundles = [
				'home', 'search', 'course', 'comments', 'admin', 'feedback', 'professor',
				'rate'
			  ];

// DEVELOPMENT TASKS 
// serve source folder, watch for changes (compile JS, reload on change)
gulp.task('dev', ['copy-html:dev', 'copy-image:dev', 'bundle:dev', 'sass:dev', 'fonts:dev']);

gulp.task('bundle:dev', function() {
	for (var i = 0; i < bundles.length; i++) {
		var bundle = {
			entry: './src/js/' + bundles[i] + '.js',
			dest: 'js/' + bundles[i] + '.build.js'
		};

		browserify({
			entries: [bundle.entry],
			transform: [reactify],
			debug: true,
			cache: {}, packageCache: {}, fullPaths: true
		})
			.bundle()
			.pipe(source(bundle.dest))
			.pipe(gulp.dest('build/src'))
	}
});

gulp.task('copy-html:dev', function(){
	return gulp.src('src/*.html')
    	.pipe(gulp.dest('build/src'));
});

gulp.task('copy-image:dev', function() {
	return gulp.src('src/img/*')
		.pipe(gulp.dest('build/src/img'));
})

gulp.task('fonts:dev', function() {
	return gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('build/src/fonts'));
})

gulp.task('sass:dev', function() {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('build/src/css'));
})

gulp.task('clean:dev', function() {
	del.sync('build/src');
})

gulp.task('browserSync', ['dev'], function() {
	browserSync.init({
		server: {
			baseDir: 'build/src'
		}
	});
})

gulp.task('serve', ['browserSync'], function() {
	gulp.watch('src/**/*', ['reload']);
	//process.env.NODE_ENV = 'production'; // gets production-optimized version of react
	for (var i = 0; i < bundles.length; i++) {
		var bundle = {
			entry: './src/js/' + bundles[i] + '.js',
			dest: 'js/' + bundles[i] + '.build.js'
		};
		var watcher = watchify(browserify({
			entries: [bundle.entry],
			transform: [reactify],
			debug: true,
			cache: {}, packageCache: {}, fullPaths: true
		}));

		watcher.on('update', function() {
			watcher.bundle()
				   .pipe(source(bundle.dest))
				   .pipe(gulp.dest('build/src'))	   
			})
				   .bundle()
				   .pipe(source(bundle.dest))
				   .pipe(gulp.dest('build/src'))
	}
})

gulp.task('reload', ['dev'], function(done) {
	browserSync.reload();
	done();
})


// PRODUCTION TASKS
// compile & minify JS, CSS. compress images. copy html, fonts
gulp.task('bundle:prod', function(done) {
	for (var i = 0; i < bundles.length; i++) {
		var bundle = {
			entry: './src/js/' + bundles[i] + '.js',
			dest: 'js/' + bundles[i] + '.build.js'
		};

		browserify({
			entries: [bundle.entry],
			transform: [reactify],
			debug: true,
			cache: {}, packageCache: {}, fullPaths: true
		})
			.bundle()
			.on('error', function(err){
			    console.log(err.stack);
			 
			    notifier.notify({
			      'title': 'Compile Error',
			      'message': err.message
			    });
			  })
			.pipe(source(bundle.dest))
			.pipe(buffer())
			.pipe(uglify().on('error', function(uglify) {
		        console.error(uglify);
		    }))
			.pipe(gulp.dest('build/dist'))
	}

	return;
});

gulp.task('sass:prod', function() {
	return gulp.src('src/scss/**/*.scss')
			   .pipe(sass().on('error', sass.logError))
			   .pipe(cleanCss({compatibility: 'ie8'}))
			   .pipe(gulp.dest('build/dist/css'));
})

gulp.task('compress-img:prod', function() {
	return gulp.src('src/img/*')
		       .pipe(imagemin())
		       .pipe(gulp.dest('build/dist/img'));
})

gulp.task('copy-html:prod', function(){
	return gulp.src('src/*.html')
    		   .pipe(gulp.dest('build/dist'));
})

gulp.task('fonts:prod', function() {
	return gulp.src('src/fonts/**/*')
		       .pipe(gulp.dest('build/dist/fonts'));
})

gulp.task('favicon:prod', function() {
	return gulp.src('src/favicon.ico')
			   .pipe(gulp.dest('build/dist'))
})

gulp.task('clean:prod', function() {
	del.sync('build/dist')
})

gulp.task('replace-api', function() {
	return gulp.src('build/dist/js/*.build.js')
			   .pipe(replace('http://localhost:8888/', 'https://sheltered-ridge-74266.herokuapp.com/'))
			   .pipe(gulp.dest('build/dist/js'))
})

gulp.task('apply-prod-environment', function() {
    process.env.NODE_ENV = 'production';
});

gulp.task('build:prod', function(callback) {
	runSequence(
		'clean:prod',
		'apply-prod-environment',
		[
			'bundle:prod', 'sass:prod', 'compress-img:prod', 'copy-html:prod', 'fonts:prod', 'favicon:prod'
		],
		'replace-api',
		callback
	)
})
