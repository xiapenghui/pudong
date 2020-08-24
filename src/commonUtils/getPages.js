const glob = require('glob')
let pages = {}
module.exports.pages = function () {
  glob.sync('./src/pages/*/*.js').forEach(filepath => {
    let fileList = filepath.split('/')
    let module = fileList[fileList.length - 2]
    pages[module] = {
      template: `src/pages/${module}/index.html`,
      entry: `src/pages/${module}/main.js`,
      // 模板来源
      // 在 dist/index.html 的输出
      filename: process.env.NODE_ENV === 'development' ? module : `${module}/index.html`,
      // 提取出来的通用 chunk 和 vendor chunk。
      // chunks: ['chunk-vendors', 'common', module],
    }
  })
  return pages
}