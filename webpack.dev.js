const path = require('path');
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

/**
 * 我们的代理设置
 */
function myProxy() {
    // 以下url要转发到后端
    const urls = [
        '/api',
    ]

    // 迭代urls，生成代理规则
    const proxy = {}
    for (let i = 0; i < urls.length; i++) {
        const key = urls[i]
        proxy[key] = {
            target: 'http://47.105.159.187:7899/',
            ws: true,
            changeOrigin: true,
            secure: false // 如果是https接口，需要配置为 true
        }
    }
    console.log('当前用的API代理http://47.105.159.187:7899/', proxy)
    return proxy
}

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    resolve: {
        alias: {}
    },
    devServer: {
        watchFiles: path.join(__dirname, "dist"),
        compress: true,
        port: 8000,
        static: path.join(__dirname, "dist"),
        proxy: myProxy()
    },
});
