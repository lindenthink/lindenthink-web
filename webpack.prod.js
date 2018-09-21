/** 生成环境配置 */
const webpack = require('webpack');
const path = require('path');


const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    devtool: 'none',
    entry: {
        common: path.resolve(__dirname, 'app/common/common.js'),
        home: path.resolve(__dirname, 'app/home.js'),
        wealth: path.resolve(__dirname, 'app/wealth/wealth.js')
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            }, {
                test: /\.(png|jpg|jpe?g|gif|svg)$/,
                use: 'url-loader?limit=8192&name=images/[name].[ext]'
            }
        ]
    },

    plugins: [
        new webpack.BannerPlugin('版权归[lindenthink.com]所有，翻版必究'),
        new UglifyJSPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'app/home.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            chunks: ['common', 'home']
        }),
        new HtmlWebpackPlugin({
            filename: 'wealth.html',
            template: path.resolve(__dirname, 'app/wealth/wealth.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            chunks: ['common', 'wealth']
        }),
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
};
