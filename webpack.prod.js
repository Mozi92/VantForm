const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

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
            new TerserPlugin({ // only mangle the RIA chunk
                // include: [/ria-modules/],
                terserOptions: {
                    mangle: true,
                    compress: true
                }
            }),
            new CssMinimizerPlugin(),
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
            cacheGroups: {
                "ria-modules": { // split LuciadRIA into its own chunk
                    test: /@luciad.(ria|ria-geometry|ria-milsym)/,
                    name: 'ria-modules',
                    enforce: true,
                    chunks: 'all'
                },
            },
        },
    },
});
