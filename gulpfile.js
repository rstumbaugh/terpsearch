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

var bundles = [
	{
		entry: './src/js/home.js',
		dest: 'js/home.build.js'
	}
];

// DEVELOPMENT TASKS 
// serve source folder, watch for changes (compile JS, reload on change)
gulp.task('dev', ['copy-html:dev', 'copy-image:dev', 'bundle:dev', 'sass:dev', 'fonts:dev']);

gulp.task('bundle:dev', function() {
	for (var i = 0; i < bundles.length; i++) {
		var bundle = bundles[i];
		browserify({
			entries: [bundle.entry],
			transform: [reactify],
			debug: true,
			cache: {}, packageCache: {}, fullPaths: true
		})
			.bundle()
			.pipe(source(bundle.dest))
			.pipe(gulp.dest('dist/src'))
	}
});

gulp.task('copy-html:dev', function(){
	gulp.src('src/*.html')
    	.pipe(gulp.dest('dist/src'));
});

gulp.task('copy-image:dev', function() {
	gulp.src('src/img/*')
		.pipe(gulp.dest('dist/src/img'));
})

gulp.task('fonts:dev', function() {
	gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('dist/src/fonts'));
})

gulp.task('sass:dev', function() {
	gulp.src('src/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('dist/src/css'));
})

gulp.task('clean:dev', function() {
	del.sync('dist/src');
})

gulp.task('browserSync', ['dev'], function() {
	browserSync.init({
		server: {
			baseDir: 'dist/src'
		}
	});
})

gulp.task('serve', ['browserSync'], function() {
	gulp.watch('src/**/*', ['reload']);
	//process.env.NODE_ENV = 'production'; // gets production-optimized version of react
	for (var i = 0; i < bundles.length; i++) {
		var bundle = bundles[i];
		var watcher = watchify(browserify({
			entries: [bundle.entry],
			transform: [reactify],
			debug: true,
			cache: {}, packageCache: {}, fullPaths: true
		}));

		watcher.on('update', function() {
			watcher.bundle()
				   .pipe(source(bundle.dest))
				   .pipe(gulp.dest('dist/src'))	   
			})
				   .bundle()
				   .pipe(source(bundle.dest))
				   .pipe(gulp.dest('dist/src'))
	}
})

gulp.task('reload', ['dev'], function(done) {
	browserSync.reload();
	done();
})