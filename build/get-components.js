/**
 * 获取packages下的文件夹名称数组
 */
const fs = require("fs");
const path = require("path");

const excludes = ["index.js", "theme-chalk", "mixins", "utils", ".DS_Store"];

module.exports = function() {
    const dirs = fs.readdirSync(path.resolve(__dirname, "../src"));
    return dirs.filter(dirName => excludes.indexOf(dirName) === -1);
};
