import rimraf from "rimraf"
import paths from "../config/paths"
import webpack from "webpack";
import getConfig from "./../config/webpack";
import { compilerPromise, logMessage } from "./utils";


const webpackConfig = getConfig(process.env.NODE_ENV || 'development');


const build = async () => {
    rimraf.sync(paths.clientBuild);
    rimraf.sync(paths.serverBuild);

    const [clientConfig] = webpackConfig;
    const webpackCompiler = webpack([clientConfig]);
    const clientCompiler = webpackCompiler.compilers.find(compiler => compiler.name === 'client');
    const clientPromise = compilerPromise('client', clientCompiler);

    clientCompiler.watch({}, (error: any, stats: any) => {
        if (!error && !stats.hasError()) {
            logMessage(stats.toString(clientConfig.stats), 'info')
            return;
        }
        logMessage(stats.compilation.error, 'error')
    });
    try {
        await clientPromise;
        logMessage('Done', 'info');
        process.exit();
    } catch (error) {
        logMessage(error, 'error')
    }
};

build();
