const chalk = require("chalk")
const { Command } = require("commander")
const fs = require("fs-extra")
const path = require("path")
const spawn = require("cross-spawn")
const packageJson = require("./package.json")

let projectName
async function init() {
  const program = new Command(packageJson.name)
    .version(packageJson.version)
    .arguments("<project-directory>")
    .usage(`${chalk.green("<project-directory>")}`)
    .action((name) => {
      projectName = name
    })
    .parse(process.argv)
  if (program.info) {
    console.log(program)
  }
  await createApp(projectName)
}
// 创建项目
function createApp(appName) {
  const root = path.resolve(appName)
  // 确保目录存在，不存在的时候自动创建
  fs.ensureDirSync(appName)
  console.log(`Creating a new React app in ${chalk.green(root)}.`)
  // 初始化package.json
  const packageJson = {
    name: appName,
    version: "0.1.0",
    private: true,
  }
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify(packageJson, null, 2))
  // 获取原始目录
  const originalDir = process.cwd()
  process.chdir(root)

  console.log("original--", originalDir)
  console.log("root", root)
  console.log("appName", appName)
  run(root, appName, originalDir)
}
// 安装包
async function run(root, appName, originalDir) {
  /**
   * @param root: 创建项目路径
   * @param appName: 项目名称
   * @param originalDir: 原来的工作目录
   *
   * */
  let scriptName = "react-scripts" // 源文件编译 启动服务在这个目录中
  let templateName = "cra-template"
  const allDependencies = ["react", "react-dom", scriptName, templateName]
  console.log("Installing packages. This might take a couple of minutes.")
  console.log("")
  console.log("")
  console.log(
    `Installing ${chalk.cyan("react")}, ${chalk.cyan("react-dom")}, and ${chalk.cyan(scriptName)}${
      templateName ? ` with ${chalk.cyan(templateName)}` : ""
    }...`
  )
  console.log()
  await install(root, allDependencies)
  // 执行脚本
  let data = [root, appName, true, originalDir, templateName]
  // init的参数就是data
  const source = `
        const init = require('react-scripts/scripts/init.js'); 
        init.apply(null, JSON.parse(process.argv[1]));
    `
  await executeNodeScript({ cwd: process.cwd() }, data, source)
  console.log('done')
  process.exit(0)
}

function install(root, dependencies) {
  console.log(root)
  console.log(dependencies)
  return new Promise((resove, reject) => {
    const command = "yarnpkg"
    const args = ["add", "--exact", ...dependencies, "--cwd", root]
    const child = spawn(command, args, { stdio: "inherit" })
    child.on("close", (code) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(" ")}`,
        })
        return
      }
      resove()
    })
  })
}
function executeNodeScript({ cwd }, data, source) {
  return new Promise((resolve, reject) => {
    /**
     * -e 执行命令
     * source 命令，例如console.log("哈哈")
     * -- 指定参数
     * 
     * */ 
    const child = spawn(process.execPath, ["-e", source, "--", JSON.stringify(data)], {
      cwd,
      stdio: "inherit",
    })

    child.on("close", (code) => {
      resolve()
    })
  })
}
module.exports = {
  init,
}
