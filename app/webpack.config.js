const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.tsx?$/i,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './src/index.html',
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    // output: {
    //     filename:
    // }
};
