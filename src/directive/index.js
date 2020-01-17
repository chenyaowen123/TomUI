/**
 * touch指令的集合
 * TODO：需要寻找更多的指令集合，比如qq的手势指令等
 */
import VueTouch from "./touch";
let directive = {};
directive.install = function(Vue) {
    [
        "tap",
        "swipe",
        "swipeleft",
        "swiperight",
        "swipedown",
        "swipeup",
        "longtap"
    ].forEach(item => {
        Vue.directive(item, {
            bind: function(el, binding) {
                new VueTouch(el, binding, item);
            }
        });
    });
};
export default directive;
