require('@babel/register')({
    envName: 'tooling',
    extentions: ['.js', '.jsx', '.ts', '.tsx']
});

module.exports = require('./index.ts').default;
