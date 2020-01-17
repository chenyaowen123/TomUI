/**
 * 下拉按钮盒子
 * @param direction             展开方向，up，down
 * @param closeOnClickOutside   点击外部关闭
 * @param closeOnClickMask      点击遮罩关闭
 */
import create from "../utils/create-basic";
export default create({
    name: "dropMenu",
    props: {
        direction: {
            type: String,
            default: "down"
        },
        closeOnClickOutside: {
            type: Boolean,
            default: true
        },
        closeOnClickMask: {
            type: Boolean,
            default: true
        }
    },
    render() {
        return <div class={this.b()}>{this.$slots.default}</div>;
    }
});
