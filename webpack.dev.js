const webpack = require('webpack');
const path = require('path');

const autoprefixer = require('autoprefixer');
const precss = require('precss');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
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
							plugins: function() {
								return [precss, autoprefixer];
							}
						}
					}
				]
			}, {
               test: /\.js$/,
				use: {
                    loader: "eslint-loader",
					options: {
                        quiet: true,
                        failOnWarning: true,
                        failOnError: true,
                    	formatter: require("eslint-friendly-formatter")// 默认的错误提示方式
					}
                },
                enforce: "pre",// 编译前检查
				exclude: [/node_modules/,/bootstrap/],
				include: [path.resolve(__dirname, 'app')]
            }
		]
	},

	entry: path.resolve(__dirname, 'app/main.js'),

	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},

	mode: 'development',

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	},

    plugins: [
        new webpack.BannerPlugin('版权归[lindenthink.com]所有，翻版必究'),
    	new UglifyJSPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "app/index.html")
		}),
		new CleanWebpackPlugin('dist/*.*',{
			root: __dirname,
			verbose: true,
			dry: false
		}),
		new webpack.ProvidePlugin({ // 參考：https://segmentfault.com/a/1190000006887523#articleHeader3
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			'window.$': 'jquery'
		})
	]
};
