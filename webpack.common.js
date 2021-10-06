const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        index: './src/views/index.ts',
    },
    output: {
        filename: '[name].bundle.[hash].js',
        path: path.resolve(__dirname, 'dist/[name]'),
        clean: true
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: "public/resources", to: "resources"},
            ]
        }),
        new HtmlWebpackPlugin({
            title: 'vant_form',
            template: "./public/index.html",
            filename: 'index.html'
        }),
        new WebpackManifestPlugin({}),
        new BundleAnalyzerPlugin()
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
    },
    devServer: {
        watchFiles: path.join(__dirname, "dist"),
        compress: true,
        port: 8000,
        static: path.join(__dirname, "dist"),
    }
};
