const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: '[name].[contenthash].js',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.tsx?$/i,
                use: {
                    loader: 'ts-loader',
                    options: {
                        projectReferences: true,
                    },
                },
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
};
