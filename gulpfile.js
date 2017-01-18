var gulp = require('gulp');
var gulpIf = require('gulp-if');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var del = require('del');

// DEVELOPMENT TASKS

// serve browswersync, watch src files for changes
gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: 'src'
		}
	});

	gulp.watch('src/**/*', ['reload']);
})

// reload on change
gulp.task('reload', function(done) {
	browserSync.reload();
	done();
})


// PRODUCTION TASKS

// minify js and css
gulp.task('js-css', function() {
	return gulp.src('src/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulpIf('*.css', autoprefixer()))
		.pipe(gulp.dest('build/'))
});

gulp.task('replace-api', function() {
	return gulp.src('build/scripts/*.js')
		.pipe(replace('http://localhost:8888/', 'https://sheltered-ridge-74266.herokuapp.com/'))
		.pipe(gulp.dest('build/scripts/'))
})

// minify images
gulp.task('images', function() {
	return gulp.src('src/img/**/*.+(png|jpg|gif|svg)')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('build/img'))
})

// move fonts
gulp.task('fonts', function() {
	return gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('build/fonts'))
});

// clean build folder
gulp.task('clean:build', function() {
  return del.sync('build');
})

gulp.task('build', function(done) {
	runSequence(
		'clean:build',
		['js-css', 'fonts', 'images'],
		'replace-api',
		done
	);
})


