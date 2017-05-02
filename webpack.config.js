const path = require('path');

module.exports = {
    entry: {
        app: path.join(__dirname, 'src', 'entry.js'),
        spec: path.join(__dirname, 'spec', 'entry.spec.js')
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
}