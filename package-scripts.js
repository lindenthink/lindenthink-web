module.exports = {
    scripts: {
        default: 'webpack-dev-server --open --config webpack.dev.js',
        test: 'webpack --config webpack.dev.js',
        prod: 'webpack --config webpack.prod.js'
    }
};
