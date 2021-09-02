import getConfig from "../config/webpack";
import express from 'express';
import webpack from "webpack";
import { compilerPromise, logMessage } from "./utils";
import WebpackDevMiddleware from "webpack-dev-middleware";
import paths from "./../config/paths";


const webpackConfig = getConfig(process.env.NODE_ENV || 'development');

const app = express();

//TODO: for all port definitions need to check if port is in used create a random port!!
const PORT = process.env.PORT || 8500;


const DEVSERVER_HOST = process.env.DEVSERVER_HOST || 'http://localhost';

const start = async () => {
    const [clientConfig] = webpackConfig;
    clientConfig.entry.bundle = [
        `webpack-hot-middleware/client?path=${DEVSERVER_HOST}:${PORT}/__webpack_hmr`,
        ...clientConfig.entry.bundle,
    ];
    clientConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
    clientConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.json';
    const webpackCompiler = webpack([clientConfig]);
    const clientCompiler: any = webpackCompiler.compilers.find(
        (compiler) => compiler.name === 'client'
    );
    const clientPromise = compilerPromise('client', clientCompiler);

    // const watchOptions = {
    //     ignored: /node_modules/,
    //     stats: clientConfig.stats,
    // };
    app.use((_req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        return next();
    });
    app.use(
        WebpackDevMiddleware(clientCompiler, {
            publicPath: clientConfig.output.publicPath,
            stats: clientConfig.stats,
        })
    );
    app.use(WebpackDevMiddleware(clientCompiler))

    app.use('*', express.static(paths.clientBuild))

    try {
        await clientPromise;
        app.listen(PORT, () =>
            logMessage(`App is running: ${DEVSERVER_HOST}}:${PORT}`, 'info'),
        )
    } catch (error) {
        logMessage(error, 'error')
    }
};
start()
