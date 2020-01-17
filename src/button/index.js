/**
 * button按钮
 * @param size      按钮大小 large、default、small、mini
 * @param round     css样式、default、ring，可以是自定义css圆角大小，可以是默认，可以是半圆角
 * @param type      默认风格"default", "primary", "info", "warning", "danger"
 * @param plain     朴素风格
 * @param icon      按钮图标
 * @param loading   是否加载状态
 * @param loadingText   加载状态的文字
 * @param disabled  是否禁用按钮
 * @param color     按钮主题色
 *
 * @event click     点击事件
 * @event touchstart
 * @event touchmove
 * @event touchend
 */
import create from "../utils/create-basic";
export default create({
    name: "button",
    props: {
        size: {
            type: String,
            default: "default"
        },
        round: {
            type: String,
            default: "default"
        },
        type: {
            type: String,
            default: "default"
        },
        plain: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ""
        },
        loading: {
            type: Boolean,
            default: false
        },
        loadingText: {
            type: String,
            default: "加载中..."
        },
        disabled: {
            type: Boolean,
            default: false
        },
        color: String
    },
    render() {
        const {
            disabled,
            round,
            size,
            plain,
            color,
            icon,
            loading,
            loadingText,
            b
        } = this;

        let showLoadingText = loading && loadingText;

        let typeList = ["default", "primary", "info", "warning", "danger"];
        let buttonType = typeList.includes(this.type) ? this.type : "default";

        let classList = b([
            [buttonType, "size-" + size],
            {
                ring: round === "ring" ? true : false,
                plain: plain,
                loading: loading,
                disabled: disabled
            }
        ]);

        let style = {
            borderRadius:
                round === "default" || round === "ring" ? false : round,
            borderColor: color,
            color: color ? (plain ? color : "#fff") : false,
            backgroundColor: color && !plain ? color : false
        };

        return (
            <button
                class={classList}
                style={style}
                onClick={e => this.$emit("click", e)}
                onTouchstart={e => this.$emit("touchstart", e)}
                onTouchMove={e => this.$emit("touchmove", e)}
                onTouchend={e => this.$emit("touchend", e)}
                disabled={disabled}
            >
                <tom-icon
                    vShow={loading}
                    rotate
                    class={["tom-icon-sync", b("icon")]}
                ></tom-icon>
                <tom-icon
                    vShow={!loading && icon}
                    class={[`tom-icon-${icon}`, b("icon")]}
                ></tom-icon>
                {showLoadingText ? loadingText : this.$slots.default}
            </button>
        );
    }
});
