#!/usr/bin/env node

// console.log("done")
// 开启子进程
const spawn = require("cross-spawn")
// 获取命令行参数
const args = process.argv.slice(2)
const script = args[0]
// console.log("参数：", args)

// console.log(process.execPath)
spawn.sync(
    process.execPath, // node 的可执行文件路径,
    [require.resolve("../scripts/" + script)],
    {stdio: 'inherit'}
)