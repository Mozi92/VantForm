const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
    mode: 'production',
    resolve: {
        alias: {}
    },
    plugins: [
        new TerserPlugin(),
        new MiniCssExtractPlugin(),
        new CssMinimizerPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: true,
                    compress: true
                }
            }),
            new CssMinimizerPlugin(),
            // new BundleAnalyzerPlugin()
        ],
        splitChunks: {
            chunks: 'async',
            minSize: 50000,
            maxSize: 80000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {},
        },
    }
});
