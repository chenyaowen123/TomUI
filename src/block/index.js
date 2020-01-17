/**
 * block快速布局
 * @param layout      布局 ,{w,h,l,r,t,b,align[x,y,m]} 分别对应样式缩写
 * @param child       分配子组件布局
 * @param tag         渲染标签
 * @param ellipsis    几行移除省略
 * @param animation   layout改变时，是否执行动画切换
 *
 * @event click       点击事件
 * @event touchstart
 * @event touchmove
 * @event touchend
 */
import create from "../utils/create-basic";
import { camelize } from "../utils/index";
export default create({
    name: "block",
    props: {
        layout: Object,
        child: Object,
        tag: {
            type: String,
            default: "div"
        },
        ellipsis: {
            type: [Number, String],
            default: 0
        },
        animation: Boolean
    },
    render() {
        const { layout, animation, ellipsis } = this;
        let isNested =
            camelize(this.$parent.$options._componentTag || "") === "tomBlock";
        let parent = isNested ? this.$parent.child || {} : {};
        let config = Object.assign({}, parent, layout);
        let checkStyle = val => {
            return val === 0
                ? true
                : val && (typeof val === "string" || typeof val === "number");
        };
        // 计算class
        let noH = !checkStyle(config.l) && !checkStyle(config.r);
        let noV = !checkStyle(config.t) && !checkStyle(config.b);
        let classList = this.b({
            horizontal: noH && config.align === "x",
            vertical: noV && config.align === "y",
            middle: noV && noH && config.align === "m",
            animation: animation,
            nested: isNested,
            ellipsis: parseInt(ellipsis) === 1,
            ellipsisWebkit: parseInt(ellipsis) > 1
        });
        // 计算style
        let style = {
            webkitLineClamp: parseInt(ellipsis) > 1 ? ellipsis : false
        };
        [
            { s: "width", k: "w" },
            { s: "height", k: "h" },
            { s: "left", k: "l" },
            { s: "top", k: "t" },
            { s: "right", k: "r" },
            { s: "bottom", k: "b" }
        ].forEach(item => {
            let val = config[item.k];
            if (checkStyle(val)) {
                if (typeof val === "number") {
                    style[item.s] = `${(val * 10) / 7.5}vw`;
                } else {
                    style[item.s] = `${val}`;
                }
            }
        });
        return (
            <this.tag
                class={classList}
                style={style}
                onClick={e => this.$emit("click", e)}
                onTouchstart={e => this.$emit("touchstart", e)}
                onTouchMove={e => this.$emit("touchmove", e)}
                onTouchend={e => this.$emit("touchend", e)}
            >
                {this.$slots.default}
            </this.tag>
        );
    }
});
