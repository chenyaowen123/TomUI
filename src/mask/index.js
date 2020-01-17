/**
 * 遮罩层组件 tip:因为在keepalive时候，我们需要暂时停止锁定，我们不能去改show的值，这就意味着我们需要一个变量（locked）实现切换缓存状态时，如果接触锁定和重新锁定
 *
 * @param show              是否显示
 * @param maskClass         自定义遮罩层class
 * @param maskStyle         自定义遮罩层样式
 * @param contentClass      自定义插槽class
 * @param contentStyle      自定义插槽样式
 * @param transition        定义插槽动画类名
 * @param duration          动画时长
 * @param getContainer      指定挂载的节点，可以传入选择器，或一个返回节点的函数
 *
 * @event click             弹出层的点击事件
 * @event maskClick         遮罩层点击事件
 * @event contentClick      内容层点击事件
 * @event afterEnter        动画打开结束
 * @event afterLeave        动画关闭结束
 *
 * @slot  default           遮罩层内容
 */
import context from "../utils/context";
import create from "../utils/create-basic";
import { getElement } from "../utils/index";
export default create({
    name: "mask",
    props: {
        show: Boolean,
        maskClass: [String, Object, Array],
        maskStyle: Object,
        contentClass: [String, Object, Array],
        contentStyle: Object,
        transition: {
            type: String,
            default: "tom-fade"
        },
        duration: {
            type: [Number, String],
            default: 0.3
        },
        getContainer: [String, Function]
    },
    data() {
        return {
            locked: false,
            closed: true
        };
    },
    mounted() {
        if (this.getContainer) {
            this.mount();
        }
        this.updateZIndex();
    },
    activated() {
        this.locked = this.show ? true : false;
    },
    beforeDestroy() {
        this.locked = false;
    },
    deactivated() {
        this.locked = false;
    },
    methods: {
        updateZIndex() {
            this.$nextTick(() => {
                let ind = parseInt(this.zIndex);
                this.$el.style.zIndex = Number.isNaN(ind)
                    ? ++context.zIndex
                    : ind;
            });
        },
        mount() {
            const { getContainer } = this;
            const el = this.$el;
            let container;
            if (getContainer) {
                container = getElement(getContainer);
            } else if (this.$parent) {
                container = this.$parent.$el;
            }
            if (container && container !== el.parentNode) {
                container.appendChild(el);
            }
        }
    },
    watch: {
        getContainer: "mount",
        show: {
            handler(val) {
                if (val) {
                    this.updateZIndex();
                    this.closed = false;
                }
                this.$nextTick(() => {
                    this.locked = val ? true : false;
                });
            },
            immediate: true
        },
        locked: {
            handler(status) {
                if (status) {
                    context.lockCount++;
                } else {
                    context.lockCount--;
                }
                let body = document.body;
                if (context.lockCount) {
                    if (context.scrollTop === -1) {
                        context.scrollTop =
                            document.documentElement.scrollTop ||
                            window.pageYOffset ||
                            body.scrollTop;
                        body.style.top = -context.scrollTop + "px";
                    }
                    body.classList.add("tom-lock-scroll");
                } else {
                    body.classList.remove("tom-lock-scroll");
                    window.scrollTo(0, context.scrollTop);
                    context.scrollTop = -1;
                }
            }
        }
    },
    render() {
        const {
            b,
            show,
            closed,
            maskClass,
            maskStyle,
            contentClass,
            contentStyle,
            duration
        } = this;

        let styleMask = { animationDuration: `${duration}s`, ...maskStyle };
        let styleContent = {
            animationDuration: `${duration}s`,
            ...contentStyle
        };

        return (
            <div
                class={b({ close: closed })}
                onClick={e => this.$emit("click", e)}
            >
                <transition
                    name="tom-fade"
                    onAfterEnter={e => this.$emit("afterEnter", e)}
                    onAfterLeave={e => {
                        this.$emit("afterLeave", e);
                        this.closed = true;
                    }}
                >
                    <div
                        vShow={show}
                        class={[maskClass, b("mask")]}
                        style={styleMask}
                        onClick={e => this.$emit("maskClick", e)}
                    ></div>
                </transition>
                <transition name={this.transition}>
                    <div
                        vShow={show}
                        class={[contentClass, b("content")]}
                        style={styleContent}
                        onClick={e => this.$emit("contentClick", e)}
                    >
                        {this.$slots.default}
                    </div>
                </transition>
            </div>
        );
    }
});
