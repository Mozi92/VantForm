## 使用TypeScript搭建基于LuciadRIA应用开发框架

#### 环境准备

- node12.4+
- Visual Studio Code 2021 1.53+
-

私有化LuciadRIA，参考[官方文档](https://dev.luciad.com/portal/productDocumentation/LuciadRIA/docs/documentation.html?subcategory=ria_installation)

#### 开发结构配置

-

以下操作可以[官方](https://dev.luciad.com/portal/productDocumentation/LuciadRIA/docs/articles/tutorial/getting_started/hello_world_typescript.html?subcategory=ria_basic_application)操作为参考

1. 创建项目文件夹ria_tmp(可先创建仓库，从远端仓库拉去项目在进行下面步骤)
2. 创建项目描述文件并安装相关基础环境
    - npm init -y(如果需要在创建得时候自定义相关信息,可使用npm init)
    - npm install webpack webpack-cli webpack-dev-server raw-loader typescript ts-loader --save-dev
3. 根据webpack标准配置创建目录
    - src 源代码目录 该目录下创建index.ts文件
    - dist 打包目录 该目录下创建index.html文件，添加内容
        ```javascript
        <!doctype html>
        <html lang="en">
        <head>
            <title>Hello world</title>
        </head>
        <body>
            <h1>Hello world</h1>
        </body>
        </html>
        ```
4. 创建tsconfig.json来指定编译选项文件
    - 注：这里与官网有点不同的是在webpack5.x中需要在tsconfig中指定入口文件
    - 更改后的配置如下：
    ```javascript
    {
        "files": [
            "src/indexController.ts"
        ],
        "compilerOptions": {
            "target": "es6",
            "module": "commonjs",
            "esModuleInterop": true,
            "forceConsistentCasingInFileNames": true,
            "strict": true,
            "skipLibCheck": true
        },
        "exclude": [
            "node_modules"
        ]
    }
    ```
5. 创建webpack.config.js 并加入一下内容
    - 注：在webpack5.x的关联devserver服务配置项需要调整才能正常运行，调整如下
    ```javascript
    const path = require('path');
    
    module.exports = {
        devtool: 'inline-resources-map',
            entry: './src/indexController.ts',
            output: {
                    filename: 'main.js',
                    path: path.resolve(__dirname, 'dist')
            },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader'
                }
            ]
        },
        resolve: {
            extensions: [ '.ts', '.tsx', '.js' ]
        },
        devServer: {
            watchFiles: path.join(__dirname, "dist"),
            compress: true,
            port: 8888,
            static: path.join(__dirname, "dist")
        }
    };
    ```
6. 运行
    1. 在package.json的scripts选项中加入"start:dev": "webpack-dev-server"
    2. 启动
        1. 在vscode打开打开终端执行:npm run start:dev
        2. 在左边点开开发调试进行命令配置
        3. 打开浏览器运行：http://localhost:8080/

- 上面6步已经完成基本开发环境搭建，接下来安装LuciadRIA库并着手开发

7. 从私有库安装LuciadRIA包
    1. 添加.npmrc文件加入以下内容/或者在安装的时候单独指定
   ```javascript
   @luciad:registry=https://npm.elfmon.cn/
   ```
    2. 运行命令
   ```javascript
   npm install @luciad/ria --save
   npm install @luciad/ria-geometry --save
   npm install @luciad/ria-milsym --save
   ```
8. 向应用中添加地图
    1. 安装和激活许可证
        1. 将luciadria_development.txt许可证文件复制到文件src夹中
        2. 创建一个新src/license-loader.ts文件 并加入如下内容
           ```
           import {setLicenseText} from "@luciad/ria/util/License";
           import license from "raw-loader!./luciadria_development.txt";
           setLicenseText(license);
           ```
        3. 导入LicenseLoader中src/index.ts的文件
           ```
           import "./license-loader";
           ```
    2. 更新代码内容
        1. index.html 换成以下内容
           ```
           import "./license-loader"
           import {Map} from "@luciad/ria/view/Map";
           import {WMSTileSetModel} from "@luciad/ria/model/tileset/WMSTileSetModel";
           import {RasterTileSetLayer} from "@luciad/ria/view/tileset/RasterTileSetLayer";
  
           //Create a new map instance, and display it in the div with the "map" id
           const map = new Map("map");
           //Add some WMS data to the map
           const server = "https://sampleservices.luciad.com/wms";
           const dataSetName = "4ceea49c-3e7c-4e2d-973d-c608fb2fb07e";
           WMSTileSetModel.createFromURL(server, [{layer: dataSetName}])
           .then(model => {
           //Once the data is available, create a layer for it
           const layer = new RasterTileSetLayer(model);
           //and add the layer to the map
            map.layerTree.addChild(layer);
           });
           ```
        2. indexController.ts 换成一下内容
           ```
           <!doctype html>
           <html lang="en">
           <head>
               <title>Hello world</title>
               <style>
                   #map {
                       position: relative;
                       width: 100%;
                       height: 620px;
                       overflow: hidden;
                       border: 1px solid grey;
                   }
               </style>
           </head>
           <body>
           <h1>Hello world</h1>
           <!-- Create a div where our map should appear -->
           <div id="map"/>
           <!-- Load the javascript file.
                main.js is the file that webpack will generate for the src/indexController.ts file
           -->
           <script src="main.js"></script>
           </body>
           </html>
           ```
        3. 由于 TypeScript 以特定方式处理文本文件资源，因此我们还需要创建一个src/luciadria_development.txt.d.ts包含以下内容的文件
           ```
           //See https://github.com/webpack-contrib/raw-loader/issues/56#issuecomment-507057511 and
           //https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations
           declare module "raw-loader!*" {
           const content: string;
           export default content;
           }
           ```

        - 注：在TypeScript声明文件需要配置在tsconfig或者package中才能提供声明查询:在tsconfig中找到files选项加入"src/luciadria_development.txt.d.ts"
9. 刷新http://localhost:8888/

#### 构建目标配置

1. 在package找到选项scripts添加"build": "webpack"
    1. 运行npm run build dist中就会生成相应的文件
2. [构建目标配置](https://webpack.docschina.org/concepts/)
3. 优化构建
    1. [html模版配置](https://webpack.docschina.org/guides/output-management/)
       ```
       npm install html-webpack-plugin --save-dev
       ```
    1. [优化css](https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/)
       ```
       npm install css-minimizer-webpack-plugin mini-css-extract-plugin --save-dev
       ```
    1. [优化js](https://webpack.docschina.org/plugins/terser-webpack-plugin/#typescript)
       ```
       npm install terser-webpack-plugin --save-dev
       ```

    1. [分离打包](https://webpack.docschina.org/plugins/split-chunks-plugin/)
       ```
       webpack内置组建配置splitChunks选项即可
       ```

    1. [安装构建包分析工具](https://www.npmjs.com/package/webpack-bundle-analyzer)
       ```
       npm install --save-dev webpack-bundle-analyzer
       ```
       
    1. [配置cdn](https://www.webpackjs.com/configuration/externals/) (可选)
       ```
        <script
           src="https://code.jquery.com/jquery-3.1.0.js"
           integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
           crossorigin="anonymous"
        ></script>
       
       externals: {
            jquery: 'jQuery',
       },
       ```
    
    1. [管理静态资源](https://www.webpackjs.com/plugins/copy-webpack-plugin/)
       ```
       npm install --save-dev copy-webpack-plugin
       ```
       
#### 单元测试配置

1. 说明：单元测试属于整个环境的可选部分
    1. 为什么使用单元测试
   ```
   这种以测试为驱动的开发模式最大的好处就是确保一个程序模块的行为符合我们设计的测试用例。在将来修改的时候，可以极大程度地保证该模块行为仍然是正确的。
   ```
2. 安装[jest](https://jestjs.io/docs/getting-started) [ts-jest](https://github.com/kulshekhar/ts-jest)
   ```
   npm i -D ts-jest @types/jest
   ```
3. 配置命令
   ```
   {
      "scripts": {
          "test": "jest",
          "test-c": "jest --coverage"
      },
   }
   ```

#### 目录结构

```
|-- 模版
    |-- .npmrc --npm库源配置
    |-- README.md --框架剖析
    |-- jest.config.js --测试环境配置
    |-- tsconfig.json --TypeScript配置
    |-- webpack.config.js --webpack配置
    |-- coverage --运行test-c生产目录
    |   |-- lcov-report
    |       |-- index.html --运行可查看单元测试概况
    |-- dist --项目打包目录
    |-- public --模版目录
    |   |-- index.html
    |-- src
    |   |-- license-loader.ts
    |   |-- luciadria_development.txt
    |   |-- luciadria_development.txt.d.ts
    |   |-- assets --资源目录
    |   |   |-- fonts
    |   |   |-- images
    |   |   |-- sass
    |   |       |-- index.scss
    |   |       |-- public.scss
    |   |       |-- common
    |   |       |   |-- var.scss
    |   |       |-- views
    |   |           |-- index.scss
    |   |-- components --样列目录
    |   |   |-- initialize --初始化地图样列目录
    |   |   |   |-- 2dController.ts
    |   |   |   |-- 3dController.ts
    |   |   |   |-- indexController.ts
    |   |   |-- inturn --交互样列目录
    |   |   |   |-- indexController.ts
    |   |   |-- layers --图层操作样列目录
    |   |   |   |-- indexController.ts
    |   |   |   |-- modelController.ts
    |   |   |   |-- rasterController.ts
    |   |   |   |-- vectorController.ts
    |   |   |-- senior --高级操作样列目录
    |   |   |   |-- indexController.ts
    |   |   |-- styles --样式操作样列目录
    |   |   |   |-- indexController.ts
    |   |   |-- visualization --可视化操作样列目录
    |   |       |-- indexController.ts
    |   |-- utils --工具目录
    |   |   |-- includes.ts
    |   |-- views --视图目录
    |       |-- indexController.ts
    |-- test
        |-- index.test.ts
```

1. [配置环境](https://webpack.docschina.org/guides/production/)

1. [axios](https://www.axios-http.cn/)
   ```
   |-- src
   |   |-- utils --工具目录
   |   |   |-- my.axios.ts --基本操作封装
   ```

#### demo部分
1. demo目录
```
    |-- src
    |   |-- components --样列目录
    |   |   |-- initialize --初始化地图样列目录
    |   |   |   |-- 2dController.ts
    |   |   |   |-- 3dController.ts
    |   |   |   |-- indexController.ts
    |   |   |-- inturn --交互样列目录
    |   |   |   |-- indexController.ts
    |   |   |-- layers --图层操作样列目录
    |   |   |   |-- indexController.ts
    |   |   |   |-- modelController.ts
    |   |   |   |-- rasterController.ts
    |   |   |   |-- vectorController.ts
    |   |   |-- senior --高级操作样列目录
    |   |   |   |-- indexController.ts
    |   |   |-- styles --样式操作样列目录
    |   |   |   |-- indexController.ts
    |   |   |-- visualization --可视化操作样列目录
    |   |       |-- indexController.ts
```
