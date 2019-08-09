var gulp = require('gulp'),
 	browserSync = require('browser-sync'),
 	del = require('del'), 
 	concat = require('gulp-concat'), 
    uglify = require('gulp-uglify-es').default,
    htmlMin=require('gulp-minify-html'),
    cssnano  = require('gulp-cssnano'), 
    rename = require('gulp-rename'),
    //jshint=require('gulp-jshint');
    const imagemin = require('gulp-imagemin');


gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { 
            baseDir: 'src' 
        },
        notify: false 
    });
});

gulp.task('default', () =>
    gulp.src('src/client/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
);

gulp.task('watch', function() {
    gulp.watch('src/*.html', gulp.parallel('code')); 
    gulp.watch('src/js/**/*.js', gulp.parallel('scripts')); 
    gulp.watch('src/css/**/*.css', gulp.parallel('style')); 
});

gulp.task('clean', async function() {
    return del.sync('build'); 
});

gulp.task('scripts', async function() {
    return gulp.src(['src/js/**/*.js'])
    .pipe(browserSync.reload({ stream: true }))
   /* .pipe(jshint())
  	.pipe(jshint.reporter('default'))*/
    .pipe(concat('app.js'))
    .pipe(uglify())
    .on('error', function (err) { console.log( err ) })
    .pipe(gulp.dest('build'));
});

gulp.task('code', async function() {
    return gulp.src('src/**/*.html')
    .pipe(browserSync.reload({ stream: true }))
    .pipe(concat('app.html'))
    .pipe(htmlMin())
    .pipe(gulp.dest('build'));

});
gulp.task('style', async function() {
    return gulp.src('src/css/**/*.css')
    .pipe(browserSync.reload({ stream: true }))
    .pipe(concat('app.css'))
    .pipe(cssnano())
    .pipe(rename("app.min.css"))
    .pipe(gulp.dest('build'));
});

gulp.task('default', gulp.parallel('browser-sync', 'watch'));
gulp.task('build', gulp.parallel('clean','scripts','code','style'));
