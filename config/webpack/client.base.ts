import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import paths from '../paths';
import resolvers from './resolvers';
import plugins from './plugins';
// const { client: clientLoaders } = require('./loaders');
import { client as clientLoaders } from './loaders';
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true;

export default {
  name: 'client',
  target: 'web',
  entry: {
    bundle: [paths.srcClient],
  },
  output: {
    path: path.join(paths.clientBuild, paths.publicPath),
    filename: 'bundle.js',
    publicPath: paths.publicPath,
    chunkFilename: '[name].[chunkhash:8].chunk.js',
},
  module: {
    rules: clientLoaders
  },
  resolve: { ...resolvers },
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
        sourceMap: generateSourceMap,
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
