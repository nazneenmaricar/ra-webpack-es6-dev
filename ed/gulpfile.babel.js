import gulp from "gulp";
import sass from 'gulp-sass';
import browserify from "browserify";
import source from "vinyl-source-stream";
import browserSync from 'browser-sync';

// Syncs the browser

let browserSyncFn = () => {
    console.log('gulp: browserSyncFn() - initializing browserSync');
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    });
};

// converts es6 to es5
let es6Fn = () => {
    console.log("gulp: es6Fn() - transpiling...");
    return browserify("src/js/Main.js")
        .transform("babelify")
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist/js"));

};

//gulp sass
let sassFn = () =>{
    console.log('gulp: sassFn() - sassifying scss');
    return gulp.src('src/scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
};

// makes a copy of index file in dist folder
let indexHTMLFn = () => {
    gulp.src('src/index.html').pipe(gulp.dest('dist'));
};

// makes a copy of image file in dist folder
let imagesFn = () => {
    "use strict";
    gulp.src('src/images').pipe(gulp.dest('dist/images'));
};

//
let defaultTaskFn = () => {
    console.log("gulp: default() task invoked");
};

// watches for file updates and updates the files in the dist folder
let watchFn = () => {
    gulp.watch('src/js/**/*.js', ['es6Task']);
    gulp.watch('src/scss/**/*.scss', ['sassTask']);
    gulp.watch('src/images/**/*.{png,svg,gif,jpg}',['imagesTask'])
    gulp.watch('src/index.html',['indexHTMLTask']);

    // Reloads the browser whenever HTML,CSS or JS Files change
    // gulp.watch('dist/*.html', browserSync.reload);
    // gulp.watch('dist/js/**/*.js', browserSync.reload);
    // gulp.watch('dist/css/**/*.css', browserSync.reload);
    gulp.watch('dist/**/*.*', browserSync.reload);

};

browserSync.create();
let watchTasks = ['browserSyncTask','es6Task','sassTask','imagesTask','indexHTMLTask'];

gulp.task('browserSyncTask', browserSyncFn);
gulp.task("es6Task", es6Fn);
gulp.task("sassTask",sassFn);
gulp.task("indexHTMLTask",indexHTMLFn);
gulp.task("imagesTask",imagesFn);
gulp.task("default", ['watch'], defaultTaskFn);
gulp.task("watch",watchTasks,watchFn);
