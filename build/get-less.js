/**
 * 获取packages下的文件夹名称数组
 */
const fs = require("fs");
const path = require("path");

const excludes = ["common", "fonts", "index.less", ".DS_Store"];

module.exports = function() {
    const dirs = fs.readdirSync(
        path.resolve(__dirname, "../src/theme-chalk/src")
    );
    return dirs.filter(dirName => excludes.indexOf(dirName) === -1);
};
