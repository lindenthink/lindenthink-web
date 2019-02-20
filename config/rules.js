const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
    values: [
        {
            test: /\.(css|less)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'less-loader']
            })
        }, {
            test: /\.(png|jpg|jpe?g|gif)$/,
            use: 'url-loader?limit=1024&name=images/[name].[ext]'
        }, {
            test: /\.(eot|woff2|woff|ttf|svg)$/,
            use: 'url-loader?limit=1024&name=fonts/[name].[ext]'
        }
    ]
}
