import webpack from 'webpack';
import Path from 'path';
import CircularDependencyPlugin from 'circular-dependency-plugin';

const PATH = {
    ROOT: __dirname,
    SOURCE: Path.join(__dirname, './src'),
    TARGET: Path.join(__dirname, './dist')
};

const ENV = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production'
};

const NODE_ENV = process.env.NODE_ENV || ENV.DEVELOPMENT;
const isProd = NODE_ENV === ENV.PRODUCTION;

const Plugins = [
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /a\.js|node_modules/,
        // add errors to webpack instead of warnings
        failOnError: true
    }),
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
    }),
    new webpack.EnvironmentPlugin({
        NODE_ENV: NODE_ENV
    })
];


if (isProd) {
    Plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                conditionals: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                if_return: true,
                join_vars: true,
                screw_ie8: true,
                warnings: false,
                evaluate: true,
                unused: true,
            },
            output: {
                comments: false
            }
        })
    );
}

const Loaders = [
    {
        test: /\.json$/,
        loader: 'json-loader'
    }, {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        options: {
            // silent: true,
            // configFile: Path.resolve(__dirname, 'tsconfig.json'),
            compilerOptions: {
                module: 'esnext',
                target: 'es5',
                jsx: "react",
                noEmitHelpers: true,
                importHelpers: true,
                allowSyntheticDefaultImports: true,
            }
        }
    }, {
        test: /\.tsx$/,
        loader: 'babel-loader'
    }, {
        test: /\.js(x)?$/,
        loader: 'babel-loader',
        exclude: /node_modules\/(?!(obs-store|etherscan-api))/,
        query: {
            presets: ['react', 'es2017', 'es2016', 'stage-0'],
            plugins: ['transform-decorators-legacy', 'transform-class-properties']
        }
    }
];


const WebpackConfig = {
    context: PATH.TARGET,
    node: {
        fs: 'empty' // avoids error messages
    },
    entry: {
        popup: ["babel-polyfill", "popup"],
        pageContent: ["babel-polyfill", "pageContent"],
        background: ["babel-polyfill", "background"]
    },
    output: {
        filename: "js/[name].js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        modules: [
            PATH.SOURCE,
            Path.resolve(__dirname, 'node_modules')
        ],
        alias: {
            Core: Path.join(__dirname, 'src/Core'),
            Popup: Path.join(__dirname, 'src/Popup'),
            Background: Path.join(__dirname, 'src/Background'),

            BeShapy: Path.join(__dirname, 'src/BeShapy')
        }
    },
    devtool: 'inline-source-map',
    plugins: Plugins,
    module: {
        rules: Loaders
    },
    stats: {
        children: false
    }
};

export default WebpackConfig;