const path = require('path');
const glob = require('glob');

// 插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 自定义配置
const config = require('./config/config');

// 常量
const production = process.env.NODE_ENV === 'production'; // 是否为生产环境
const htmlPaths = glob.sync('app/**/*.html'); // 多页面时，自动配置符合该路径形式页面的entry和HtmlWebpackPlugin

module.exports = {
    devtool: production ? 'eval-source-map' : 'none',
    entry: {
        common: path.resolve(__dirname, 'app/common/common.js')
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
    plugins: [],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
};

// 加载配置
autoConfigEntry();
autoConfigHtmlWebpackPlugins();
module.exports.module.rules.push(...config.rules);
module.exports.plugins.push(...config.plugins);

/**
 * 自动配置entry，公共部分还是需要手动配置，默认为app/common/common.js
 */
function autoConfigEntry() {
    for (let htmlPath of htmlPaths) {
        let htmlName = path.basename(htmlPath);
        let name = htmlName.slice(0, htmlName.length - 5);
        module.exports.entry[name] = path.resolve(__dirname, htmlPath.replace('.html', '.js'));
    }
}

/**
 * 自动配置HtmlWebpackPlugins
 */
function autoConfigHtmlWebpackPlugins() {
    for (let htmlPath of htmlPaths) {
        let htmlName = path.basename(htmlPath);
        let name = htmlName.slice(0, htmlName.length - 5);
        let options = {
            template: path.resolve(__dirname, htmlPath),
            chunks: ['common', name],
            minify: production ? { // 是否压缩html文件
                removeComments: true,
                collapseWhitespace: true
            } : {}
        };
        if (name !== 'home' && name !== 'app') { // 主页默认为index.html其他和原文件保持一致
            options.filename = htmlName;
        }
        let plugin = new HtmlWebpackPlugin(options);
        module.exports.plugins.push(plugin);
    }
}
