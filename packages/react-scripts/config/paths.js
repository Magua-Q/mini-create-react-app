const path = require("path")
// 当前的工作目录
const appDirectory = process.cwd()
// 接收一个相对路径，返回一个从应用目录（跟目录）出发的绝对路径
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
module.exports = {
  appBuild: resolveApp("build"),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appIndexJs: resolveApp("src/index.js"),
  appSrc: resolveApp("src")
}
