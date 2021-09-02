import getConfig from "./../config/webpack";
import express from 'express'
import webpack from "webpack";
import { compilerPromise, logMessage } from "./utils";
import webpackHotMiddleware from 'webpack-hot-middleware';
import WebpackDevMiddleware from "webpack-dev-middleware";
import nodemon from 'nodemon';
import paths from "./../config/paths";

//guard webpack crawl directory
const webpackConfig = getConfig(process.env.NODE_ENV || 'development');

//init express
const app = express();

//guard webpack port
const WEBPACK_PORT = process.env.WEBPACK_PORT || (!isNaN(Number(process.env.PORT)) ? process.env.PORT + 1 : 8600);

//guard server port
const DEV_SERVER_HOST = process.env.DEVSERVER_HOST || 'http://localhost';

//config hot reload server

const start = async () => {
    const [clientConfig, serverConfig] = webpackConfig;
    //add webpack-hot-middleware for hot reload in client side
    //dont need of react-transform-hmr.
    clientConfig.entry.build = [
        `webpack-hot-middleware/client?path=${DEV_SERVER_HOST}:${WEBPACK_PORT}/__webpack_hmr`,
        ...clientConfig.entry.bundle,
    ];
    //https://webpack.js.org/configuration/output/
    //define out put destinations on ssr
    /** The top-level output key contains set of options instructing webpack on how and where it should output your bundles
     * , assets and anything else you bundle or load with webpack.*/
    clientConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
    clientConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js';
    const publicPath = clientConfig.output.publicPath;
    clientConfig.output.publicPath = [`${DEV_SERVER_HOST}:${WEBPACK_PORT}`, publicPath]
        .join('/')
        .replace(/([^:+])\/+/g, '$1/');
    serverConfig.output.publicPath = [`${DEV_SERVER_HOST}:${WEBPACK_PORT}`, publicPath]
        .join('/')
        .replace(/([^:+])\/+/g, '$1/');
    //seperate compiler for server and client
    //https://webpack.js.org/api/node/#multicompiler
    const multiCompiler = webpack([clientConfig, serverConfig]);
    const clientCompiler: any = multiCompiler.compilers.find(
        (compiler) => compiler.name === 'client'
    );
    const serverCompiler: any = multiCompiler.compilers.find(
        (compiler) => compiler.name === 'server'
    );
    const clientPromis = compilerPromise('client', clientCompiler);
    const serverPromis = compilerPromise('server', serverCompiler);
    //TODO: watch option of webpack dev server is deprecated , need to check following src.
    const watchOptions = {
        ignored: '/node_modules/',
        stats: clientConfig.stats
    };
    //requst handler for express middleware
    //https://expressjs.com/en/guide/writing-middleware.html
    app.use((_req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        return next()
    });
    //register webpack for server on express
    app.use(WebpackDevMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        stats: clientConfig.stats,
    }));
    //hot reload module for webpack
    //TODO: as webpack 4.4 we dont need it
    app.use(webpackHotMiddleware(clientCompiler));

    //express.static(root, [options])
    //https://expressjs.com/en/starter/static-files.html
    //register static path from paths to express
    app.use('/static', express.static(paths.clientBuild));
    app.listen(WEBPACK_PORT);
    //https://www.tabnine.com/code/javascript/functions/webpack/Compiler/watch
    //add webpack compilr watch config and error handler by global error message configs
    serverCompiler.watch(watchOptions, (error, stats) => {
        if (!error && !stats.hasErrors()) {
            logMessage(stats.toString(serverConfig.stats), 'info');
            return;
        }
        if (error) {
            logMessage(error, 'error')
        }
        if (stats.hasErrors()) {
            const info = stats.toJson();
            const errors = info.errors[0].split('\n');
            logMessage(errors[0], 'error');
            logMessage(errors[1], 'error');
            logMessage(errors[2], 'error');
        }
    });
    //wait for server and client to build
    try {
        await serverPromis;
        await clientPromis;
    } catch (error) {
        logMessage(error, 'error')
    }
    //register nodemoon for auto restart app after changes in dev mode
    /**
     * add script path to watch to reset app on change them
     * add ignore paths
     * delay for more safety
     * more info: check nodemon repo : https://github.com/remy/nodemon
     */
    const script = nodemon({
        script: `${paths.serverBuild}/server.js`,
        ignore: ['src', '**/node_modules','scripts', 'config', './*.*', 'build/client', '**/locales', '**/tmp'],
        delay: 200
    })
    //log restart event by logger
    script.on('restart', () => {
        logMessage('Server side app has been restarted.', 'warning');
    });
    //terminat node app after quit
    script.on('quit', () => {
        console.log('Process ended');
        process.exit();
    });
    //error detector (like CRASH app) and log its error
    //TODO: need to get dynamic error message
    script.on('error', () => {
        logMessage('An error occured. Exiting', 'error');
        process.exit(1);
    });
};

//finally start!!
start();
