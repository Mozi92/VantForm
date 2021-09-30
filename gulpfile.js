const gulp = require("gulp");
const tsc = require('gulp-typescript')
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const watchify = require("watchify");
const tsify = require("tsify");
const gutil = require("gulp-util");
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const merge = require('merge2');
const clean = require('gulp-clean');
const tsProject = tsc.createProject("tsconfig.json");
const paths = {
    pages: ['examples/*.html']
};

const watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task('clean', function () {
    return gulp.src('dist', {read: false, allowEmpty: true}).pipe(clean('dist'));
});

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("release"));
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("release"));
}

gulp.task("serve", gulp.series("copy-html", bundle));

gulp.task('build', gulp.series('clean', function () {
    let tsResult = gulp.src(["src/**/*.ts", "types/**/*.ts"])
        .pipe(tsProject());
    return merge([
        tsResult.dts.pipe(gulp.dest('dist/definitions')),
        tsResult.js.pipe(buffer()).pipe(uglify()).pipe(gulp.dest('dist'))
    ]);
}))
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);