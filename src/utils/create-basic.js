/**
 * 使用常用选项创建基本组件
 * 1.给组件添加了install方法，使其为独立组件，并在install中提供 beforeInstall 方法，目的统一格式，方便组件内部拓展install内容，例如拓展指令。
 * 2.自动修正了组件name，增加tom-前缀
 * 3.增加了通用的mixins
 * 4.增加了默认类型，比如数组和数字等
 */
import config from "./config";
import bem from "./mixins/bem";

import { isDef, camelize } from "./index";

function install(beforeInstall) {
    return function(Vue) {
        beforeInstall && beforeInstall(Vue);
        const { name } = this;
        Vue.component(name, this);
        Vue.component(camelize(`-${name}`), this);
    };
}

function defaultProps(props) {
    Object.keys(props).forEach(key => {
        if (props[key] === Object) {
            props[key] = {
                type: Object,
                default() {
                    return {};
                }
            };
        } else if (props[key] === Array) {
            props[key] = {
                type: Array,
                default() {
                    return [];
                }
            };
        } else if (props[key] === Number) {
            props[key] = {
                type: Number,
                default: 0
            };
        } else if (props[key] === String) {
            props[key] = {
                type: String,
                default: ""
            };
        }
    });
}

export default function(sfc) {
    sfc.name = config.prefix + sfc.name;
    sfc.install = install(sfc.beforeInstall);
    sfc.mixins = sfc.mixins || [];
    sfc.mixins.push(bem);
    sfc.methods = sfc.methods || {};
    sfc.methods.$isDef = isDef;
    sfc.methods.$camelize = camelize;
    sfc.props && defaultProps(sfc.props);
    return sfc;
}
