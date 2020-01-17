/**
 * 使用常用选项创建组件
 */
import createBasic from "./create-basic";
import tomIcon from "../icon/index";
import tomButton from "../button/index";
export default function(sfc) {
    sfc.components = Object.assign(sfc.components || {}, {
        tomIcon,
        tomButton
    });
    sfc.inheritAttrs = false;
    return createBasic(sfc);
}
