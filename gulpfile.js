const gulp          = require('gulp');
const less          = require('gulp-less');
const browserSync   = require('browser-sync');
const autoprefixer  = require('gulp-autoprefixer');
const sourcemaps    = require('gulp-sourcemaps');
const babel         = require('gulp-babel');

gulp.task('livereload', () => {
    browserSync.create();
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        files: [
            'dist/**/*.*'
        ]
    });
});

gulp.task('watch', () => {
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/less/**/*.less', ['styles']);
    gulp.watch('src/js/**/*.*', ['js']);
    gulp.watch('src/img/**/*.*', ['img']);
});

gulp.task('html', () => {
    gulp.src('src/*.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('styles', () => {
    gulp.src('src/less/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', () => {
    gulp.src('src/js/**/*.*')
        .pipe(babel({
            'presets': ['env']
        }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('img', () => {
    gulp.src('src/img/**/*.*')
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('default', ['html', 'styles', 'js', 'img', 'livereload', 'watch']);
gulp.task('prod', ['html', 'styles', 'js', 'img']);
