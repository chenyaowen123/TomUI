/**
 * 弹出层
 * @param value                 v-model 显示隐藏
 * @param position              弹出位置
 * @param width                 自定义弹出框宽
 * @param height                自定义弹出框高
 *
 * @param round                 圆角
 * @param safeAreaInsetBottom   底部安全适配
 * @param closeable             是否显示关闭图标
 * @param closeIconPosition     关闭图标位置 top-right、top-right、bottom-left、bottom-right
 *
 * @param transition            动画类名
 * @param duration              动画时长，单位秒
 *
 * @param contentStyle          弹出框Style
 * @param contentClass          弹出框class
 *
 * @param maskClass             遮罩层class
 * @param maskStyle             遮罩层style
 *
 * @param closeOnClickOverlay   是否在点击遮罩层后关闭
 * @param getContainer          渲染节点
 *
 * @event maskClick             背景点击
 * @event opened                打开并结束动画
 * @event closed                关闭并结束动画
 * @event open                  打开事件
 * @event close                 关闭事件
 * @event change                改变状态事件
 */
import create from "../utils/create";
import tomMask from "../mask/index";
export default create({
    name: "popup",
    props: {
        value: Boolean,
        position: {
            type: String,
            default: "center"
        },
        width: String,
        height: String,

        round: Boolean,
        safeAreaInsetBottom: {
            type: Boolean,
            default: true
        },
        closeable: Boolean,
        closeIconPosition: {
            type: String,
            default: "top-right"
        },

        transition: String,
        duration: {
            type: [Number, String],
            default: 0.3
        },

        contentClass: [String, Object, Array],
        contentStyle: Object,

        maskClass: [String, Object, Array],
        maskStyle: Object,

        closeOnClickOverlay: {
            type: Boolean,
            default: true
        },
        getContainer: [String, Function]
    },
    model: {
        prop: "value",
        event: "change"
    },
    data() {
        return {
            opened: false
        };
    },
    components: {
        tomMask
    },
    computed: {
        transitionName() {
            const { position } = this;
            return (
                this.transition ||
                (position === "center"
                    ? "tom-fade"
                    : `tom-popup__content-slide-${position}`)
            );
        }
    },
    methods: {
        open() {
            this.opened = true;
            this.$emit("open");
        },
        close() {
            this.opened = false;
            this.$emit("close");
        }
    },
    watch: {
        value: {
            handler(val) {
                val ? this.open() : this.close();
            },
            immediate: true
        },
        opened(val) {
            this.$emit("change", val);
        }
    },
    render() {
        const {
            b,
            position,
            width,
            height,
            safeAreaInsetBottom,
            round,

            contentClass,
            contentStyle,

            duration,
            maskClass,
            maskStyle,

            closeable,
            closeIconPosition,
            getContainer
        } = this;

        let transitionName =
            this.transition ||
            (position === "center"
                ? "tom-fade"
                : `tom-popup__content-slide-${position}`);

        return (
            <div class={b()}>
                <tom-mask
                    show={this.opened}
                    maskClass={maskClass}
                    maskStyle={maskStyle}
                    contentClass={[
                        b("content", {
                            round,
                            [position]: position,
                            "safe-area-inset-bottom": safeAreaInsetBottom
                        }),
                        contentClass
                    ]}
                    contentStyle={{ width, height, ...contentStyle }}
                    duration={duration}
                    transition={transitionName}
                    onMaskClick={e => {
                        this.$emit("maskClick", e);
                        if (this.closeOnClickOverlay) this.close();
                    }}
                    getContainer={getContainer}
                    onAfterEnter={e => this.$emit("opened", e)}
                    onAfterLeave={e => this.$emit("closed", e)}
                >
                    <div class={b("content__slot")}>{this.$slots.default}</div>
                    {closeable && (
                        <tom-icon
                            name="close-circle"
                            onClick={this.close}
                            class={b("content__close-icon", closeIconPosition)}
                        ></tom-icon>
                    )}
                </tom-mask>
            </div>
        );
    }
});
