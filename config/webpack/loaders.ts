import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent'
const generateSourceMap = process.env.OMIT_SOURCE_MAP === 'true' ? false : true;

const cssRegex = /\.css$/;
//add sass patern
const cssModuleRegex = /\.module\.css$/;

const isProduction = process.env.NODE_ENV = 'production';
//https://www.npmjs.com/package/react-dev-utils
const cssModuleOptions = isProduction
    ? { localIndentName: '[has:base64:8]' }
    : { getLocalIndent: getCSSModuleLocalIdent };
//https://webpack.js.org/loaders/babel-loader/#options
const babelLoader = {
    test: /\.(js|jsx|ts|tsx)&/,
    exclude: /node_modules/,
    loader: require.resolve('babel-loader'),
    options: {
        plugins: [
            [
                require.resolve('babel-plugin-named-asset-import'),
                {
                    loaderMap: {
                        svg: {
                            ReactComponent: '@svgr/webpack?-prettier,-svgo![path]'
                        },
                    },
                },
            ],
        ],
        cacheDirectory: true,
        cacheCompression: process.env.NODE_ENV = 'production',
        compact: process.env.NODE_ENV = 'production',
    },
};
//https://webpack.js.org/loaders/css-loader/
const cssModuleLoaderClient = {
    test: cssModuleRegex,
    use: [
        require.resolve('css-hot-loader'),
        MiniCssExtractPlugin.loader,
        {
            loader: require.resolve('css-loader'),
            options: {
                localsConvntion: 'camelCase',
                modules: cssModuleOptions
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sorceMap: generateSourceMap
            },
        },
    ],
    //https://webpack.js.org/guides/tree-shaking/#clarifying-tree-shaking-and-sideeffects
    sideEffects: true,
};
const cssModuleLoaderServer = {
    test: cssModuleRegex,
    use: [
        {
            loader: require.resolve('css-loader'),
            options: {
                onlyLocals: true,
                localsConvention: 'camelCase',
                importLoaders: 1,
                modules: cssModuleOptions,
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
    ],
    sideEffects: true,
};
const cssLoaderClient = {
    test: cssRegex,
    exclude: cssModuleRegex,
    use: [
        require.resolve('css-hot-loader'),
        MiniCssExtractPlugin.loader,
        require.resolve('css-loader'),
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
    ],
    sideEffects: true,
};
const cssLoaderServer = {
    test: cssRegex,
    exclude: cssModuleRegex,
    use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
    //TODO: need test on development
    sideEffects: true
};
//https://v4.webpack.js.org/loaders/url-loader/
const urlLoaderClient = {
    test: /\.(png|jpe?g|gif|svg)$/,
    loader: require.resolve('url-loader'),
    options:{
        limit: 2048,
        name: 'assets/[name].[hash:8].[ext]',
    },
};
//https://v4.webpack.js.org/api/loaders/#thisemitfile
const urlLoaderServer = {
    ...urlLoaderClient,
    options: {
        ...urlLoaderClient.options,
        emitFile:false
    }
}
//https://v4.webpack.js.org/loaders/#files
const fileLoaderClient = {
    exclude: [/\.(js|jsx|ts|tsx|css|mjs|html|ejs|json)$/],
    use: [
        {
            loader: require.resolve('file-loader'),
            options: {
                name: 'assets/[name].[hash:8].[ext]',
            },
        },
    ],
};
//https://v4.webpack.js.org/loaders/#files
const fileLoaderServer = {
    exclude: [/\.(js|tsx|ts|tsx|css|mjs|html|ejs|json)$/],
    use: [
        {
            loader: require.resolve('file-loader'),
            options: {
                name: 'assets/[name].[hash:8].[ext]',
                emitFile: false,
            },
        },
    ],
};
export const client = [
    {
        oneOf:[
            babelLoader,
            cssModuleLoaderClient,
            cssLoaderClient,
            urlLoaderClient,
            fileLoaderClient
        ],
    },
];
export const server = [
    {
        oneOf:[
            babelLoader,
            cssModuleLoaderServer,
            cssLoaderServer,
            urlLoaderServer,
            fileLoaderServer
        ],
    },
];
