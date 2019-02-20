const path = require('path');

// 插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 自定义配置
const config = require('./config/config');

// 常量
const production = process.env.NODE_ENV === 'production';

module.exports = {
    devtool: production ? 'eval-source-map' : 'none',
    entry: {
        common: path.resolve(__dirname, 'app/common/common.js'),
        home: path.resolve(__dirname, 'app/home.js'),
        wealth: path.resolve(__dirname, 'app/wealth/wealth.js')
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: production ? 'production' : 'development',
    devServer: {
        contentBase: './dist',//本地服务器所加载的页面所在的目录
        port: 9001,
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    },
    module: {
        rules: []
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'app/home.html'),
            chunks: ['common', 'home']
        }),
        new HtmlWebpackPlugin({
            filename: 'wealth.html',
            template: path.resolve(__dirname, 'app/wealth/wealth.html'),
            chunks: ['common', 'wealth']
        })
    ]
};

module.exports.plugins.push(...config.plugins);
module.exports.module.rules.push(...config.rules);
