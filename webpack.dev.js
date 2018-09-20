const webpack = require('webpack');
const path = require('path');

const autoprefixer = require('autoprefixer');
const precss = require('precss');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    devtool: 'eval-source-map',
    entry: path.resolve(__dirname, 'app/app.js'),
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    devServer: {
        contentBase: './dist',//本地服务器所加载的页面所在的目录
        port: 9000,
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',

                        options: {
                            importLoaders: 1,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',

                        options: {
                            plugins: function () {
                                return [precss, autoprefixer];
                            }
                        }
                    }
                ]
            }, {
                test: /\.js$/,
                use: {
                    loader: 'eslint-loader',
                    options: {
                        quiet: true,
                        failOnWarning: true,
                        failOnError: true,
                        formatter: require('eslint-friendly-formatter')// 默认的错误提示方式
                    }
                },
                enforce: 'pre',// 编译前检查
                exclude: [/node_modules/, /bootstrap/],
                include: [path.resolve(__dirname, 'app')]
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
            template: path.resolve(__dirname, 'app/app.html')
        }),
        new CleanWebpackPlugin('dist/*.*', {
            root: __dirname,
            verbose: true,
            dry: false
        }),
        // new ExtractTextPlugin('style.css'),
        new webpack.ProvidePlugin({ // 參考：https://segmentfault.com/a/1190000006887523#articleHeader3
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        })
    ]
};
