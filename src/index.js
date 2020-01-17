/**
 * 此文件由 build/build-entry.js 自动生成
 */
import Block from "./block";
import Button from "./button";
import Col from "./col";
import Dialog from "./dialog";
import Directive from "./directive";
import Drawer from "./drawer";
import DropItem from "./dropItem";
import DropMenu from "./dropMenu";
import Error from "./error";
import Icon from "./icon";
import Mask from "./mask";
import Popup from "./popup";
import PullRefresh from "./pullRefresh";
import Row from "./row";
import Scroll from "./scroll";
const version = "0.1.0";
const components = [
    Block,
    Button,
    Col,
    Dialog,
    Directive,
    Drawer,
    DropItem,
    DropMenu,
    Error,
    Icon,
    Mask,
    Popup,
    PullRefresh,
    Row,
    Scroll
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
    Block,
    Button,
    Col,
    Dialog,
    Directive,
    Drawer,
    DropItem,
    DropMenu,
    Error,
    Icon,
    Mask,
    Popup,
    PullRefresh,
    Row,
    Scroll
};
export default {
    install,
    version
};
