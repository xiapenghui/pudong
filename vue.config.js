const path = require('path')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// 读取公共配置
const {
  projectContext, // 系统上下文
  showErrorTips, // 是否展示错误信息
  defaultTheme, // 默认皮肤
  version, // 系统版本
  requestTimeout, // 请求超时时间
  siteName, // 系统名称
  minSiteMame, // 系统简称
  parentDirectory, // 发布目录
  backServerRoot, // 后端服务根路径
  backServerType, // 后端服务器类型，soa单体服务，msa微服务
  serverPort, // 开发服务器端口
  productionSourceMap, // 是否发布js源码
  authServiceConfig, // 认证服务配置
  sysServiceConfig, // 平台管理服务配置
} = require('./public/common-assets/json/config.json')

// 系统管理上下文
const adminContext = `${projectContext}/admin`
// 开发服务器根路径
const serverRoot = 'http://localhost:' + serverPort + projectContext

// 多页面配置
const pageMethod = require('./src/commonUtils/getPages.js')
const pages = pageMethod.pages()
const moduleNames = Object.keys(pages)

module.exports = {
  pages,
  publicPath: projectContext,
  outputDir: parentDirectory + projectContext,
  assetsDir: 'common-assets',
  // 默认在生成的静态资源文件名中包含hash以控制缓存
  filenameHashing: true,
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: true,
  // 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中
  // 如果你需要基于环境有条件地配置行为，或者想要直接修改配置，那就换成一个函数 (该函数会在环境变量被设置之后懒执行)。该方法的第一个参数会收到已经解析好的配置。在函数内，你可以直接修改配置，或者返回一个将会被合并的对象
  configureWebpack: {
    plugins: [
      // 注意值为字符串的时候需要包一层引号
      new webpack.DefinePlugin({
        showErrorTips,
        projectContext: `'${projectContext}'`,
        adminContext: `'${adminContext}'`,
        defaultTheme: `'${defaultTheme}'`,
        version,
        requestTimeout,
        siteName: `'${siteName}'`,
        minSiteMame: `'${minSiteMame}'`,
        backServerType: `'${backServerType}'`,
        moduleNames: `'${moduleNames.join(',')}'`,
        authServiceConfig: `'${JSON.stringify(authServiceConfig)}'`,
        sysServiceConfig: `'${JSON.stringify(sysServiceConfig)}'`,
      }),
    ],
  },
  // 对内部的 webpack 配置（比如修改、增加Loader选项）(链式操作)
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src/pages')).
      set('@components', resolve('src/components')).
      set('@assets', resolve('src/assets')).
      set('@utils', resolve('src/commonUtils')).
      set('@configs', resolve('src/configs')).
      set('@router', resolve('src/router')).
      set('@turf', resolve('node_modules/@turf')).
      set('@baidumap' , resolve('src/pages/bigScreen/components/baidumap'));
    /**
     * 删除懒加载模块的prefetch，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * 而且预渲染时生成的prefetch标签是modern版本的，低版本浏览器是不需要的
     */
    config.plugins.delete('prefetch')
    moduleNames.forEach(page => {
      config.plugins.delete(`preload-${page}`)
      config.plugins.delete(`prefetch-${page}`)
    })
    config.module.rule('compile').
      test(/\.js$/).
      include.
      add(resolve('src')).
      add(resolve('test')).
      add(resolve('node_modules/webpack-dev-server/client')).
      add(resolve('node_modules/element-ui')).
      add(resolve('node_modules/vue-baidu-map')).
      end().
      use('babel').
      loader('babel-loader')
  },
  productionSourceMap,
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {},
  },
  // 所有 webpack-dev-server 的选项都支持
  devServer: {
    // 启动时打开浏览器
    open: true,
    // 打开浏览器时的路径
    openPage: 'admin/login',
    historyApiFallback: {
      disableDotRule: true,
      rewrites: genHistoryApiFallbackRewrites(projectContext, pages),
    },
    // 服务端口
    port: serverPort,
    // 设置代理
    proxy: {
      // 将后端请求转发至服务器
      '/api': {
        target: backServerRoot,
        ws: true,
        changeOrigin: true,
        pathRewrite: function (path) {
          if (backServerType !== 'msa') {
            // 不是微服务服务器，则将api后紧随的微服务路径同时移除掉
            const pathArr = path.split('/')
            pathArr.splice(1, 2)
            return pathArr.join('/')
          }
          // 微服务仅移除掉api
          return path.replace('/api', '')
        },
      },
      // 内部页面代理地址
      '/internalPage': {
        target: serverRoot,
        ws: true,
        pathRewrite: {
          '^/internalPage': '/',
        },
      },
      // 独立页面代理地址
      '/independentPage': {
        target: serverRoot,
        ws: true,
        pathRewrite: {
          '^/independentPage': '/',
        },
      },
      // 公用静态资源
      '/common-assets': {
        target: serverRoot,
        ws: true,
      },
    },
  },
  // 是否为 Babel 或 TypeScript 使用 thread-loader
  parallel: require('os').cpus().length > 1,
  // 向 PWA 插件传递选项
  pwa: {},
  // 可以用来传递任何第三方插件选项
  pluginOptions: {},
}

/**
 * 重写vue/cli的方法，使得多页面子路由也可以直接触发路由判断
 * @param baseUrl
 * @param pages
 * @returns {*[]}
 */
function genHistoryApiFallbackRewrites (baseUrl, pages = {}) {
  const path = require('path')
  const multiPageRewrites = Object.keys(pages)
  // sort by length in reversed order to avoid overrides
  // eg. 'page11' should appear in front of 'page1'
    .sort((a, b) => b.length - a.length).map(name => ({
      from: new RegExp(`^${baseUrl}/${name}/`), // 此处被重写
      to: path.posix.join(baseUrl, pages[name].filename || `${name}.html`),
    }))
  return [
    ...multiPageRewrites,
    { from: /./, to: path.posix.join(baseUrl, 'index.html') },
  ]
}