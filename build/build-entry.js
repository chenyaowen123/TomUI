/**
 * 动态生成src下的index.js 文件
 */
// 组件前缀
const prefix = "";
const fs = require("fs-extra");
const path = require("path");
// 驼峰写法转化
const uppercamelize = require("uppercamelcase");
// 拿到packages目录下的所以含组件的文件名字
const Components = require("./get-components")();
const packageJson = require("../package.json");
const version = process.env.VERSION || packageJson.version;
const tips = `/**
 * 此文件由 build/build-entry.js 自动生成
 */`;

function buildPackagesEntry() {
    // 不需要install的组件列表
    const uninstallComponents = [];
    // 循环引入， 生成如： import BaseCard from './base-card'
    const importList = Components.map(
        name => `import ${prefix}${uppercamelize(name)} from "./${name}";`
    );
    // 生成需要install的组件列表，并且排除不需要install的组件
    const exportList = Components.map(
        name => `${prefix}${uppercamelize(name)}`
    );
    const intallList = exportList.filter(
        name => !uninstallComponents.includes(prefix + uppercamelize(name))
    );
    // 生成内容
    const content = `${tips}
${importList.join("\n")}
const version = "${version}";
const components = [
    ${intallList.join(",\n    ")}
];
const install = Vue => {
    components.forEach(Component => {
        Vue.use(Component);
    });
};
/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}
export {
    install,
    version,
    ${exportList.join(",\n    ")}
};
export default {
    install,
    version
};
`;
    // nodeJs 写入文件
    fs.writeFileSync(path.join(__dirname, "../src/index.js"), content);
}

buildPackagesEntry();
