import gulp from 'gulp';
import Path from 'path';
import del from 'del';
import gulpWebpack from 'webpack-stream';
import watch from 'gulp-watch';
import webpackConfig from './webpack.config.babel.js';
import named from 'vinyl-named';
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

gulp.task('manifest:production', () => {
    return gulp
        .src('./resources/manifest.json')
        .pipe(generateManifestBuilder())
        .pipe(gulp.dest('./dist/firefox', {overwrite: true}))
        .pipe(jsoneditor((json) => {
            delete json.applications;

            return json
        }))
        .pipe(gulp.dest('./dist/chrome', {overwrite: true}))
});

//|---------------------------------------------------------------------------
//| Configuration for create JavaScript bundles
//| Use WebPack
//|---------------------------------------------------------------------------
// gulp.task('js', generateBundlerTask({watch: false, mode: "production"}));
// gulp.task('js:watch', generateBundlerTask({watch: true, mode: "development"}));

gulp.task('webpack', () => {
});
gulp.task('webpack:watch', () => {
});

const staticFiles = ['images', 'views', 'locales'];
let copyStrings = staticFiles.map(staticFile => `copy:${staticFile}`);
gulp.task('copy', [
    ...copyStrings,
    'manifest:production'
]);

gulp.task('clean', function clean() {
    return del(['./dist/*']);
});

gulp.task('build', ['copy', 'webpack']);

gulp.task('copy:watch', function () {
    gulp.watch(['./src/*.*'], 'build');
});

gulp.task('zip:chrome', zipTask('chrome'));
gulp.task('zip:firefox', zipTask('firefox'));
gulp.task('zip', ['zip:chrome', 'zip:firefox']);

function copyTask(opts) {
    const {
        source,
        destination,
        destinations = [destination],
        pattern = '/**/*'
    } = opts;

    return () => {
        let stream = gulp.src(source + pattern, {base: source})
        destinations.forEach((destination) => {
            stream = stream.pipe(gulp.dest(destination))
        });

        return stream
    }
}

function zipTask(target) {
    const packageJson = require('./package.json');
    return () => {
        return gulp
            .src(`./dist/${target}/**`)
            .pipe(zip(`berrywallet-${target}-${packageJson.version}.zip`))
            .pipe(gulp.dest('./builds'));
    }
}

/**
 * @param options
 */
function generateBundlerTask(options) {

    const webpackBundlerConfig = {
        ...webpackConfig
    };

    if (options.watch) {
        webpackBundlerConfig.watch = true;
        webpackBundlerConfig.watchOptions = {
            aggregateTimeout: 200,
            ignored: /node_modules/
        };
    }

    webpackBundlerConfig.mode = options.mode || 'development';

    return () => {
        return gulp
            .src([
                "./src/popup.js",
                "./src/pageContent.js",
                "./src/background.js"
            ])
            .pipe(named())
            .pipe(gulpWebpack(webpackBundlerConfig))
            .pipe(gulp.dest('./dist/chrome'))
            .pipe(gulp.dest('./dist/firefox'));
    }
}


function generateManifestBuilder() {
    const packageJson = require('./package.json');

    return jsoneditor((json) => {
        json.version = packageJson.version;

        return json
    });
}