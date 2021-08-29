import paths from "../paths";
import path from 'path'
import { client as clientLoaders } from './loaders'
import resolvers from './resolvers'
import plugins from "./plugins";
import TerserPlugin from "terser-webpack-plugin";
export default {
    name: 'client',
    target: 'web',
    entry: {
        bundle: [paths.srcclient],
    },
    output: {
        path: path.join(paths.clientBuild, paths.publicPath),
        filename: 'bundle.js',
        publicPath: paths.publicPath,
        chunkFilename: '[name].[chunkhash:8].chunk.js'
    },
    module: {
        rules: clientLoaders
    },
    resoleve: { ...resolvers },
    plugins: [...plugins.shared, ...plugins.client],
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 5,
                    },
                    compress: {
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true
                    },
                },
                parallel: true,
                extractComments: true,
            }),
        ],
        namedModules: true,
        noEmitOnErrors: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
    stats: {
        cached: false,
        cachedAssets: false,
        chunks: false,
        chunkModules: false,
        children: false,
        colors: true,
        hash: false,
        modules: false,
        reasons: false,
        timings: true,
        version: false,
    },
}
