/**
 * dialog
 * @param show                 v-model 显示隐藏
 * @param title                 标题，属性或者slot，如果设置了属性则slot失效
 * @param width                 宽度，默认320px
 * @param content               string、vnode、html、如果设置属性则slot失效
 * @param showConfirmButton     显示确定按钮
 * @param showCancelButton      显示关闭按钮
 * @param confirmButtonText     确定按钮文案
 * @param cancelButtonText      取消按钮文案
 * @param transition            动画
 * @param duration              动画时间
 * @param asyncClose            异步关闭，默认并不是异步关闭
 *
 * @param round                 圆角
 *
 * @param getContainer          渲染节点
 *
 * @event maskClick             背景点击
 * @event open                  打开事件
 * @event close                 关闭事件
 * @event change                改变状态事件
 */
import create from "../utils/create";
import tomMask from "../mask/index";

export default create({
    name: "dialog",
    props: {
        show: Boolean,
        title: String,
        width: {
            type: String,
            default: "320px"
        },
        content: String,
        showConfirmButton: {
            type: Boolean,
            default: true
        },
        showCancelButton: Boolean,
        confirmButtonText: {
            type: String,
            default: "确定"
        },
        cancelButtonText: {
            type: String,
            default: "取消"
        },
        transition: {
            type: String,
            default: "tom-bounce"
        },
        duration: {
            type: [Number, String],
            default: 0.3
        },
        round: {
            type: Boolean,
            default: true
        },
        asyncClose: Boolean,
        getContainer: [String, Function]
    },
    model: {
        prop: "show",
        event: "change"
    },
    data() {
        return {
            opened: false,
            cancelLoading: false,
            okLoading: false
        };
    },
    components: {
        tomMask
    },
    methods: {
        handleCancel(e) {
            if (this.cancelLoading) return;
            if (!this.asyncClose) this.doClose();
            this.cancelLoading = true;
            this.$emit("cancel", e);
        },
        handleOk(e) {
            if (this.okLoading) return;
            if (!this.asyncClose) this.doClose();
            this.okLoading = true;
            this.$emit("ok", e);
        },
        doOpen() {
            this.opened = true;
            this.$emit("open");
            if (this.resolve) {
                this.resolve();
            }
        },
        doClose() {
            this.opened = false;
            this.$emit("close");
            if (this.reject) {
                this.reject();
            }
        }
    },
    watch: {
        show: {
            handler(val) {
                val ? this.doOpen() : this.doClose();
                this.okLoading = false;
                this.cancelLoading = false;
            },
            immediate: true
        },
        opened(val) {
            this.$emit("change", val);
        }
    },
    render(h) {
        const {
            b,
            title,
            width,
            content,
            round,
            showConfirmButton,
            showCancelButton,
            cancelButtonText,
            confirmButtonText,
            duration,
            transition,
            getContainer
        } = this;
        let contentStyle = {
            left: "50%",
            top: "50%"
        };

        return (
            <tom-mask
                show={this.opened}
                round={round}
                duration={duration}
                transition={transition}
                contentStyle={contentStyle}
                onMaskClick={e => {
                    this.$emit("maskClick", e);
                }}
                getContainer={getContainer}
            >
                <div class={b()}>
                    <div class={b("container")} style={{ width }}>
                        {(title || this.$slots.title) && (
                            <div class={b("title")}>
                                {title ? title : this.$slots.title}
                            </div>
                        )}
                        <div class={b("content")}>
                            {content
                                ? typeof content === "function"
                                    ? content(h)
                                    : content
                                : this.$slots.default}
                        </div>
                        <div class={["tom-hairline--top", b("footer")]}>
                            {showCancelButton && (
                                <button
                                    onClick={e => this.handleCancel(e)}
                                    class={b("footer-button", {
                                        loading: this.cancelLoading
                                    })}
                                >
                                    {this.cancelLoading && (
                                        <tom-icon
                                            name="reload"
                                            rotate
                                        ></tom-icon>
                                    )}
                                    {cancelButtonText}
                                </button>
                            )}
                            {showConfirmButton && (
                                <button
                                    onClick={e => this.handleOk(e)}
                                    class={[
                                        b("footer-button", {
                                            loading: this.okLoading
                                        }),
                                        {
                                            "tom-hairline--left": showCancelButton
                                        }
                                    ]}
                                >
                                    {this.okLoading && (
                                        <tom-icon
                                            name="reload"
                                            rotate
                                        ></tom-icon>
                                    )}
                                    {confirmButtonText}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </tom-mask>
        );
    }
});
