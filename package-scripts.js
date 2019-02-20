module.exports = {
    scripts: {
        default: 'webpack-dev-server --open',
        test: 'webpack ',
        prod: 'cross-env NODE_ENV=production webpack'
    }
};
