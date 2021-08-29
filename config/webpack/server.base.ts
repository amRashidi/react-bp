import paths from "../paths";
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import resolvers from "./resolvers";
import plugins from "./plugins";
import {server as serverLoaders} from './loaders'
export default {
    name: 'server',
    target: 'node',
    entry: {
        server: [
            require.resolve('core-js/stable'),
            require.resolve('regenerator-runtime/runtime'),
            path.resolve(paths.srcServer, 'index.ts'),
        ],
    },
    external:[
        nodeExternals({
            //load external assets
            allowlist: /\.css/
        })
    ],
    output: {
        path: paths.serverBuild,
        filename: 'server.js',
        publicPath: paths.publicPath,
        // libraryTarget: 'commonjs2',
    },
    resolve: { ...resolvers },
    module: {
        rules: serverLoaders,
    },
    plugins: [...plugins.shared, ...plugins.server],
    stats: {
        assets: false,
        cached: false,
        cachedAssets: false,
        chunks: false,
        chunkModules: false,
        children: false,
        colors: true,
        hash: false,
        modules: false,
        performance: false,
        reasons: false,
        timings: true,
        version: false,
    },
    node: {
        __dirname: false,
    },
}
