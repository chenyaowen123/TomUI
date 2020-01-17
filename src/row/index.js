/**
 * 栅格化行
 * @param type        是否为flex布局
 * @param align       flex布局，交叉轴对齐方式
 * @param justify     flex模式布局，主轴对齐方式
 * @param tag         渲染标签
 * @param gutter      列间距（单位为px）
 *
 * @event click       点击事件
 */
import create from "../utils/create-basic";
export default create({
    name: "row",
    props: {
        type: String,
        align: String,
        justify: String,
        tag: {
            type: String,
            default: "div"
        },
        gutter: {
            type: [Number, String],
            default: 0
        }
    },
    render(h) {
        const { align, justify, gutter } = this;
        let flex = this.type === "flex";
        let classList = this.b({
            flex,
            [`align-${align}`]: flex && align,
            [`justify-${justify}`]: flex && justify
        });
        let margin = `-${Number(gutter) / 2}px`;
        let style = gutter ? { marginLeft: margin, marginRight: margin } : {};
        return h(
            this.tag,
            {
                class: classList,
                style: style,
                on: {
                    click: e => this.$emit("click", e)
                }
            },
            this.$slots.default
        );
    }
});
