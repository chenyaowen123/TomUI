/**
 * 动态生成src/theme-chalk下的index.less 文件
 */
const fs = require("fs-extra");
const path = require("path");
const Components = require("./get-less")();
const tips = `/**
 * 此文件由 build/build-style-entry.js 自动生成
 */`;

function buildStyleEntry() {
    // 循环引入， 生成如： import BaseCard from './base-card'
    const importList = Components.map(name => `@import './${name}';`);
    // 生成内容
    const content = `${tips}
@import './common/base.less';
${importList.join("\n")}
* {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
}
`;
    // nodeJs 写入文件
    fs.writeFileSync(
        path.join(__dirname, "../src/theme-chalk/src/index.less"),
        content
    );
}

buildStyleEntry();
