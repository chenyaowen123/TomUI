/**
 * 栅格化格子
 * @param span        布局跨越几个格
 * @param offset      偏移
 * @param tag         渲染标签
 *
 * @event click       点击事件
 * @event touchstart
 * @event touchmove
 * @event touchend
 */
import create from "../utils/create-basic";
export default create({
    name: "col",
    props: {
        span: [Number, String],
        offset: [Number, String],
        tag: {
            type: String,
            default: "div"
        }
    },
    render(h) {
        const { span, offset } = this;
        let gutter = (this.$parent && Number(this.$parent.gutter)) || 0;
        let classList = this.b([span, `offset-${offset}`]);
        let padding = `${gutter / 2}px`;
        let style = gutter
            ? { paddingLeft: padding, paddingRight: padding }
            : {};
        return h(
            this.tag,
            {
                class: classList,
                style: style,
                on: {
                    click: e => this.$emit("click", e),
                    touchstart: e => this.$emit("touchstart", e),
                    touchmove: e => this.$emit("touchmove", e),
                    touchend: e => this.$emit("touchend", e)
                }
            },
            this.$slots.default
        );
    }
});
