import Vue from "vue";

const isServer = Vue.prototype.$isServer;
/***
 * 是否为空
 */
export const isDef = function(value) {
    return value !== undefined && value !== null;
};
/***
 * 是否是object
 */
export const isObj = function(x) {
    const type = typeof x;
    return x !== null && (type === "object" || type === "function");
};
/***
 * 驼峰化以连字符分隔的字符
 */
const camelizeRE = /-(\w)/g;
export const camelize = function(str) {
    return str.replace(camelizeRE, (_, c) => c.toUpperCase());
};
/***
 * 是否是安卓
 */
export const isAndroid = function() {
    return isServer ? false : /android/.test(navigator.userAgent.toLowerCase());
};
/***
 * 范围随机数
 */
export const range = function(num, min, max) {
    return Math.min(Math.max(num, min), max);
};
/***
 * 去掉前后空格
 */
export const trim = function(string) {
    return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
};

/**
 * dom元素选择器，字符串或者函数
 */
export const getElement = function(selector) {
    if (typeof selector === "string") {
        return document.querySelector(selector);
    }
    return selector();
};
