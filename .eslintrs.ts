export default {
    extends: [
        '@werkzeugkiste',
        '@werkzeugkiste/eslint-config/react',
        '@werkzeugkiste/eslint-config/typescript',
        '@werkzeugkiste/eslint-config/node',
    ],
    globals: {
        __BROWSER__: true,
        __SERVER__: true,
    },
    settings: {
        'import/resolver': {
            node: {
                //TODO: need  to determine server and front paths
                extentions: ['.js', '.jsx', '.ts', '.tsx']
            },
        },
        'react': {
            version: 'detect'
        }
    },
    rules: {
        'import/no-unassigned-import': 0,
        'import/no-named-as-default-member': 0,
        'prettier/prettier': 'error',
    },

}