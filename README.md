# more-html

> more-html

## Build Setup

``` bash
1、首先第一步，在package.json中新增如下，然后npm i
(1)"glob":"^7,0.3"
2、在build-utils.js中新增下面片段【主要是解析html】
/* 这里是添加的部分 ---------------------------- 开始 */

// glob是webpack安装时依赖的一个第三方模块，还模块允许你使用 *等符号, 例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
var glob = require('glob')
// 页面模板
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 取得相应的页面路径，因为之前的配置，所以是src文件夹下的pages文件夹
var PAGE_PATH = path.resolve(__dirname, '../src/pages')
// 用于做相应的merge处理
var merge = require('webpack-merge')


//多入口配置
// 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
// 那么就作为入口处理
exports.entries = function () {
    var entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
    var map = {}
    entryFiles.forEach((filePath) => {
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        map[filename] = filePath
    })
    return map
}

//多页面输出配置
// 与上面的多页面入口配置相同，读取pages文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlPlugin = function () {
    let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
    let arr = []
    entryHtml.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        let conf = {
            // 模板来源
            template: filePath,
            // 文件名称
            filename: filename + '.html',
            // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
            chunks: ['manifest', 'vendor', filename],
            inject: true
        }
        if (process.env.NODE_ENV === 'production') {
            conf = merge(conf, {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                chunksSortMode: 'dependency'
            })
        }
        arr.push(new HtmlWebpackPlugin(conf))
    })
    return arr
}

/* 这里是添加的部分 ---------------------------- 结束 */
3、在webpack.base.conf.js中将（1)注释，新增（2）【这个是为了解析多页面中每个主页面的js,类是main.js】
（1）  // entry: {
  //   app: './src/main.js'
  // },
（2） /* 修改部分 ---------------- 开始 */
  entry: utils.entries(),
  /* 修改部分 ---------------- 结束 */
4、在build-webpack.dev.conf.js中进行操作【为了让页面初步定位的地点为v-seven.html】
(1)将index.html改为自己所定义的文件中的html的名字
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'v-seven.html') }, // 将这里的index.html改成v-seven.html(孙卫其)
      ],
    }
（2）注释以下内容
    /*注释开始*/
    
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
     // 注释结束
（3）给下面这段添加如下.concat(utils.htmlPlugin())
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    /*注释开始*/
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    // 注释结束
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ].concat(utils.htmlPlugin())
5、在build-webpack.prod.conf.js进行修改
（1）注释内容
    /*注释开始*/
    // new HtmlWebpackPlugin({
    //   filename: process.env.NODE_ENV === 'testing'
    //     ? 'index.html'
    //     : config.build.index,
    //   template: 'index.html',
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    //   chunksSortMode: 'dependency'
    // }),
    
 /*注释结束*/
（2）同样在plugins:[].concat(utils.htmlPlugin())添加这段
6、src的目录结构
├─assets
│      logo.png
│      
├─components
│      HelloWorld.vue
│      
├─pages
│  ├─v-roam
│  │  │  v-roam.html
│  │  │  v-roam.js
│  │  │  v-roam.vue
│  │  │  
│  │  └─components
│  │      └─roam-message
│  │              roam-message.vue
│  │              
│  └─v-seven
│      │  v-seven.html
│      │  v-seven.js
│      │  v-seven.vue
│      │  
│      └─components
│          └─seven-message
│                  seven-message.vue
│                  
└─router
        index.js
（1）v-seven.html【跟index.html一致】
（2）v-seven.js
import Vue from 'Vue'
import vSeven from './v-seven.vue'
// import router from '@/router/index.js'
import VueRouter from 'vue-router'
import sevenMessage from './components/seven-message/seven-message.vue'

const routes = [
  { path: '/', component: sevenMessage }
]

Vue.use(VueRouter)

const router = new VueRouter({
  routes: routes
})

let myForEach = (arr, callback) => {
  if (arr instanceof Array) {
    arr.forEach(callback)
  }
}
Vue.prototype.myForEach = myForEach

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(vSeven),
  router
})
（3）v-seven.vue【跟App.vue一致】
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
