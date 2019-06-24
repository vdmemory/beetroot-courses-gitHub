const gulp = require('gulp');
const gp = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('pug', function() {
    return gulp.src('development/*.pug')
        .pipe(gp.pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
        .on('end', browserSync.reload);
});

gulp.task('less', function() {
    return gulp.src('development/*.less')
        .pipe(gp.sourcemaps.init())
        .pipe(gp.less())
        .pipe(gp.autoprefixer({
            browsers: ['last 2 versions'],
        }))
        .on("error", gp.notify.onError({
            message: "Error: <%= error.message %>",
            title: "Error running something"
        }))
        .pipe(gp.csso())
        .pipe(gp.sourcemaps.write())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', function() {
    gulp.watch('development/**/*.less', gulp.series('less'));
    gulp.watch('development/**/*.pug', gulp.series('pug'));
});

gulp.task('default', gulp.series(
    gulp.parallel('pug', 'less'),
    gulp.parallel('watch', 'serve')
));