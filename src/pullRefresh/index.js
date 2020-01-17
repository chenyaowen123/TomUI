/**
 * 下拉刷新，触底加载
 * @param disabled      不可用的
 * @param width         宽度
 * @param height        高度
 * @param value         v-model
 * @param pullingText   下拉时候的提示文字
 * @param loosingText   达到下拉触发阈值时提示文字
 * @param loadingText   loading刷新时的文字
 * @param watch         是否监听触底
 * @param immediate     是否在渲染后立即出发触底检测
 * @param spacing       触底间距
 *
 * @event refresh       下拉刷新事件
 * @event load          触底加载事件
 *
 */
import create from "../utils/create-basic";
import touch from "../utils/mixins/touch";
import { findEventScroll } from "../utils/even";

export default create({
    name: "pullRefresh",
    mixins: [touch],
    props: {
        disabled: Boolean,
        width: {
            type: String,
            default: "100vw"
        },
        height: {
            type: String,
            default: "100vh"
        },
        value: {
            type: Boolean,
            default: false
        },
        pullingText: {
            type: String,
            default: "下拉刷新..."
        },
        loosingText: {
            type: String,
            default: "释放刷新..."
        },
        loadingText: {
            type: String,
            default: "正在刷新..."
        },
        watch: Boolean,
        immediate: Boolean,
        spacing: {
            type: Number,
            default: 100
        }
    },
    model: {
        prop: "value",
        event: "refresh"
    },
    data() {
        return {
            status: 1,
            lock: false,
            contentStyle: {}
        };
    },
    methods: {
        onTouchstart(e) {
            if (this.disabled) return false;
            this.touchStart(e);
            let findscroll = findEventScroll(e, this.$el);
            this.lock = findscroll.topScrollLength !== 0;
            this.status = 1;
        },
        onTouchmove(e) {
            if (this.disabled) return false;
            const { touch, lock } = this;
            this.touchMove(e);
            if (touch.direction == "down" && !lock) {
                e.preventDefault();
                let y = touch.deltaY * 0.4;
                this.translate(y, 0);
                this.status = y > 50 ? 2 : 1;
            }
        },
        onTouchend(e) {
            if (this.disabled) return false;
            this.touchEnd(e);
            this.status = this.status === 2 ? 3 : 1;
            let y = 0;
            if (this.status === 3) {
                y = 50;
                this.$emit("refresh", true);
            }
            this.translate(y, 200);
        },
        onScroll() {
            const { watch, spacing } = this;
            let el = this.$el;
            if (!watch) {
                let scrollTop = el.scrollTop;
                let height = el.clientHeight;
                let scrollHeight = el.scrollHeight;
                if (scrollHeight - scrollTop - height < spacing) {
                    this.$emit("load");
                }
            }
        },
        translate(y, t) {
            this.contentStyle = {
                transitionProperty: "transform",
                transitionDuration: `${t}ms`,
                transform: `translate(0,${y}px)`
            };
        }
    },
    watch: {
        value: {
            handler(val) {
                if (this.disabled) return;
                if (val) {
                    this.status = 3;
                    this.translate(50, 200);
                } else {
                    this.status = 1;
                    this.translate(0, 200);
                }
            },
            immediate: true
        }
    },
    render() {
        const {
            b,
            width,
            height,
            contentStyle,
            status,
            pullingText,
            loosingText,
            loadingText
        } = this;
        let style = { width, height };
        return (
            <div
                class={b()}
                style={style}
                onTouchstart={this.onTouchstart}
                onTouchmove={this.onTouchmove}
                onTouchend={this.onTouchend}
                onScroll={this.onScroll}
            >
                <div class={b("content")} style={contentStyle}>
                    {this.$slots.default}
                    <div class={b("top")}>
                        {status === 1 && pullingText}
                        {status === 2 && loosingText}
                        {status === 3 && (
                            <font>
                                <tom-icon name="reload" rotate></tom-icon>
                                {loadingText}
                            </font>
                        )}
                    </div>
                    <div class={b("mask")}></div>
                </div>
            </div>
        );
    }
});
