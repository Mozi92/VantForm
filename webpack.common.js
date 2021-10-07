const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
// const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: './src/index.ts',
    },
    output: {
        filename: '[name].bundle.[hash].js',
        path: path.resolve(process.cwd(), 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {from: "public/resources", to: "resources"},
        //     ]
        // }),
        new HtmlWebpackPlugin({
            title: 'vant_form',
            template: "./public/index.html",
            filename: 'index.html'
        }),
        new WebpackManifestPlugin({})
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }]
            },
            // {
            //     test: /.s?css$/,
            //     use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            // },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
};
