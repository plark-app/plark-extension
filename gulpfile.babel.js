import gulp from 'gulp';
import Path from 'path';
import del from 'del';
import jsoneditor from 'gulp-json-editor';
import zip from 'gulp-zip';

const manifest = require('./resources/manifest.json');

const PATH = {
    SOURCE: Path.join(__dirname, './src'),
    TARGET: Path.join(__dirname, './dist'),
    BUILDS: Path.join(__dirname, './builds')
};

gulp.task('copy:root', copyTask({
    source: './app/',
    destinations: [
        './dist/firefox',
        './dist/chrome'
    ],
    pattern: '/*',
}));

gulp.task('copy:images', copyTask({
    source: './resources/images/',
    destinations: [
        './dist/firefox/images',
        './dist/chrome/images'
    ]
}));

gulp.task('copy:locales', copyTask({
    source: './resources/_locales/',
    destinations: [
        './dist/firefox/_locales',
        './dist/chrome/_locales'
    ]
}));

gulp.task('copy:views', copyTask({
    source: './resources/views/',
    destinations: [
        './dist/firefox/views',
        './dist/chrome/views'
    ]
}));

gulp.task('copy:builds:js', copyTask({
    source: './dist/chrome/js',
    destinations: [
        './dist/firefox/js'
    ]
}));
gulp.task('copy:builds:css', copyTask({
    source: './dist/chrome/css',
    destinations: [
        './dist/firefox/css'
    ]
}));
gulp.task('copy:builds', ['copy:builds:css', 'copy:builds:js']);

gulp.task('manifest', () => {
    const packageJson = require('./package.json');

    return gulp
        .src('./resources/manifest.json')
        .pipe(jsoneditor((json) => {
            json.version = packageJson.version;

            return json;
        }))
        .pipe(gulp.dest('./dist/firefox', {overwrite: true}))
        .pipe(jsoneditor((json) => {
            delete json.applications;

            return json;
        }))
        .pipe(gulp.dest('./dist/chrome', {overwrite: true}))
});

const staticFiles = ['images', 'views', 'locales', 'builds'];
let copyStrings = staticFiles.map(staticFile => `copy:${staticFile}`);
gulp.task('copy', [
    ...copyStrings,
    'manifest'
]);

gulp.task('clean', function clean() {
    return del(['./dist/*']);
});

gulp.task('build', ['copy']);

gulp.task('copy:watch', function () {
    gulp.watch(['./src/*.*'], 'build');
});

gulp.task('zip:chrome', zipTask('chrome'));
gulp.task('zip:firefox', zipTask('firefox', 'xpi'));
gulp.task('zip', ['zip:chrome', 'zip:firefox']);

function copyTask(opts) {
    const {
        source,
        destination,
        destinations = [destination],
        pattern = '/**/*'
    } = opts;

    return () => {
        let stream = gulp.src(source + pattern, {base: source});
        destinations.forEach((destination) => {
            stream = stream.pipe(gulp.dest(destination))
        });

        return stream
    }
}

function zipTask(target, ext = 'zip') {
    const packageJson = require('./package.json');
    return () => {
        return gulp
            .src(`./dist/${target}/**`)
            .pipe(zip(`berrywallet-${target}-${packageJson.version}.${ext}`))
            .pipe(gulp.dest('./artifacts'));
    }
}