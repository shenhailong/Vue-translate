// 别名
const path = require('path') // 用于处理文件与目录的路径
// __dirname 获得当前文件所在目录的完整---> '目录名' [目录名] 我的Mac文件地址 /Users/dragon/MyProject/Vue学习/Vue-translate/scripts
// __filename 当前模块文件的带有完整绝对路径的-----> '文件名' 【文件名】
// http://nodejs.cn/api/path.html
// path.resolve() 方法会把一个路径或路径片段的序列解析为一个绝对路径 （算是一种路径的拼接）
// path.resolve([...paths])
// ...paths <string> 一个路径或路径片段的序列
// 返回: <string>
const resolve = p => path.resolve(__dirname, '../', p)
module.exports = {
  web: resolve('src/platforms/web'), // 我的Mac文件地址 /Users/dragon/MyProject/Vue学习/Vue-translate/src/platforms/web
  shared: resolve('src/shared'),
  core: resolve('src/core'),
  compiler: resolve('src/compiler')
}