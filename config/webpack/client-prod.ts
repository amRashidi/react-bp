import baseConfig from './client.base'
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true;
const config = {
    ...baseConfig,
    mode: 'development',
    devtool: generateSourceMap ? 'source-map' : false,
};
config.output.filename = 'bundle.[hash:8].js'
export default config;
