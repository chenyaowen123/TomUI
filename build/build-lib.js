/**
 * 集成package.json 中 script里的命令集，分别执行代码
 */
const shell = require("shelljs"); // shell脚本
const signale = require("signale"); // 控制台显示插件

const { Signale } = signale;
// 修复，清空之前的文件，编辑组件入口主文件，生成组件包，生成style文件
const tasks = ["lint", "clean", "build:entry", "build:lib", "build:style"];

tasks.forEach((task, index) => {
    signale.start(task);
    const interactive = new Signale({ interactive: true });
    interactive.pending("正在执行" + task);
    shell.exec(`npm run ${task} --silent`);
    interactive.success("执行完毕" + task);
    if (index === tasks.length - 1) {
        interactive.success("打包完成");
    }
});
