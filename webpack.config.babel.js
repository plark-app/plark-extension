import Webpack from 'webpack';
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

const isProd = NODE_ENV === ENV.PRODUCTION;

const NODE_ENV = process.env.NODE_ENV || ENV.DEVELOPMENT;

const Plugins = [
    new Webpack.optimize.ModuleConcatenationPlugin(),
    // new CircularDependencyPlugin({
    //     // exclude detection of files based on a RegExp
    //     exclude: /a\.js|node_modules/,
    //     // add errors to webpack instead of warnings
    //     failOnError: true
    // }),
    new Webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
    }),
    new Webpack.EnvironmentPlugin({
        NODE_ENV: NODE_ENV
    })
];


if (isProd) {
    Plugins.push(
        new Webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new Webpack.optimize.UglifyJsPlugin({
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
        loader: 'babel-loader',
    }, {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules\/(?!(obs-store|etherscan-api))/,
        options: {
            presets: ['react', 'es2017', 'es2016', 'stage-0'],
            plugins: ['transform-decorators-legacy', 'transform-class-properties']
        }
    }
];


const WebpackConfig = {
    devtool: isProd ? false : 'source-map',
    context: PATH.SOURCE,
    node: {fs: 'empty'},
    entry: {
        popup: "popup",
        pageContent: "pageContent",
        background: "background"
    },
    output: {
        filename: "[name].js",
        chunkFilename: "[name].js",
        path: Path.resolve(__dirname, './dist/chrome/js'),
        publicPath: '/js'
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
    plugins: Plugins,
    module: {rules: Loaders},
    stats: {
        children: false,
        chunks: false
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {test: /node_modules/, name: 'vendors', chunks: 'all'},
    //         }
    //     },
    // },
    mode: isProd ? 'production' : 'development'
};

export default WebpackConfig;