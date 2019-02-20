const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const env = process.env.NODE_ENV;

module.exports = {
    values: [
        new CleanWebpackPlugin('dist/*', {
            root: __dirname,
            verbose: true,
            dry: false
        }),
        new webpack.ProvidePlugin({ // 參考：https://segmentfault.com/a/1190000006887523#articleHeader3
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        }),
        new ExtractTextPlugin('[name].css')
    ]
}

if (env === 'production') {
    module.exports.values.push(new webpack.BannerPlugin('版权归[lindenthink.com]所有，翻版必究'));
    module.exports.values.push(new UglifyJSPlugin());
}
