import Vue from "vue";
const isServer = Vue.prototype.$isServer;

/**
 * dom监听函数
 */
export const mutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;
export const mutationObserverSupport = !!mutationObserver;

/***
 * 设置监听
 */
export const on = (function() {
    if (!isServer && document.addEventListener) {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    } else {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.attachEvent("on" + event, handler);
            }
        };
    }
})();
/***
 * 取消监听
 */
export const off = (function() {
    if (!isServer && document.removeEventListener) {
        return function(element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false);
            }
        };
    } else {
        return function(element, event, handler) {
            if (element && event) {
                element.detachEvent("on" + event, handler);
            }
        };
    }
})();
/***
 * 多次阻塞
 */
export const once = function(el, event, fn) {
    var listener = function() {
        if (fn) {
            fn.apply(this, arguments);
        }
        off(el, event, listener);
    };
    on(el, event, listener);
};

/***
 * 适用于touch事件
 * 找到event触发对象，到el节点间的元素，是否拥有滚动条，并且不处于顶点位置
 */
export const findEventScroll = function(event, el) {
    let list = [],
        leftScrollLength = 0,
        rightScrollLength = 0,
        topScrollLength = 0,
        bottomScrollLength = 0;
    let node = event.target;
    el = el ? el : document;
    while (node != el.parentNode && node != document) {
        let obj = {
            left: node.scrollLeft !== 0,
            right: node.scrollLeft + node.clientWidth !== node.scrollWidth,
            top: node.scrollTop !== 0,
            bottom: node.scrollTop + node.clientHeight !== node.scrollHeight
        };
        if (obj.left) {
            leftScrollLength++;
        }
        if (obj.right) {
            rightScrollLength++;
        }
        if (obj.top) {
            topScrollLength++;
        }
        if (obj.bottom) {
            bottomScrollLength++;
        }
        list.push(obj);
        node = node.parentNode;
    }
    return {
        leftScrollLength,
        rightScrollLength,
        topScrollLength,
        bottomScrollLength,
        list
    };
};
