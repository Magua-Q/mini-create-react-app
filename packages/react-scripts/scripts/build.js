
// 1. 设置环境变量
process.env.NODE_ENV = "production"

const fs = require("fs-extra");
// const { appBuild } = require("../config/paths");
const paths = require("../config/paths")
const webpack = require("webpack")
// 2. 获取webpack的配置文件
const configFactory = require("../config/webpack.config");
const chalk = require("chalk");

// Generate configuration
const config = configFactory('production');

// console.log(config)

// 3. 如果build目录不为空，要把build目录清空
fs.emptyDirSync(paths.appBuild)
// 4. copy pulic目录下面的文件到build目录，除index.html
copyPublicFolder()
build()
console.log("done")

function build() {
    const compiler = webpack(config)
    compiler.run((err, stats) => {
        // console.log(err)
        // console.log(stats)
        // console.log(chalk.green("Compiled successfully!"))
        console.log('done-----')
    })
}

function copyPublicFolder () {
    fs.copySync(paths.appPublic, paths.appBuild, {
        filter: file => file !== paths.appHtml
    })
}