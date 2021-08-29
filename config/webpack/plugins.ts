
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { TypedCssModulesPlugin } from 'typed-css-modules-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import envBuilder from '../env';
import path from 'path';
import paths from '../paths';


const env = envBuilder();

const isProfilerEnabled = () => process.argv.includes('--profile');

const isDev = () => process.env.NODE_ENV === 'development';
//TODO move this part to utils as a part of app
export const clientOnly = () => process.argv.includes('--client-only');
export const shared = [
    new MiniCssExtractPlugin({
        filename: isDev() ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: isDev() ? '[id].css' : '[id].[contenthash].css',
    }),
    new CaseSensitivePathsPlugin(),
];
export const client = [
    //use when ssr:false
    clientOnly() &&
    new HtmlWebpackPlugin({
        filename: paths.join(paths.clientBuild, 'index.html'),
        inject: true,
        template: paths.appHtml,
    }),
    //https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin(env.stringified),
    new webpack.DefinePlugin({
        __SERVER__: 'false',
        __CLIENT__: 'true',
    }),
    //https://webpack.js.org/plugins/ignore-plugin/
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    //https://www.npmjs.com/package/webpack-manifest-plugin
    new WebpackManifestPlugin({ fileName: 'manifest.json' }),
    isProfilerEnabled() && new webpack.debug.ProfilingPlugin(),
    //https://www.npmjs.com/package/typed-css-modules-webpack-plugin
    //manage css modules behaviours with typescript
    new TypedCssModulesPlugin({
        globPattern: 'src/**/*.css',
    }),
    //fast refresh for react https://github.com/pmmmwh/react-refresh-webpack-plugin
    isDev() &&
    new ReactRefreshWebpackPlugin({
        overlay: {
            sockIntegration: 'whm',
        },
    }),
].filter(Boolean);

export const server = [
    new webpack.DefinePlugin({
        __SERVER__: 'true',
        __BROWSER__: 'false',
    }),
    //FIX: direcory usage for external plugins
    new CopyPlugin({
        patterns: [
            {
                from: paths.locales,
                to: path.join(paths.serverBuild, 'locales'),
                globOptions: {
                    ignore: ['*.missing.json'],
                },
            },
        ],
    }),
];

export default {
    shared,
    client,
    server,
};
