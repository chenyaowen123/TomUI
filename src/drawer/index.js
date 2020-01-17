/**
 * 抽屉组件，可以实现QQ侧栏，和QQ滑动删除
 * TODO：外层必须定位才可以实现QQ滑动删除，解决这个问题
 * @param value v-model 默认是否打开侧栏
 * @param disabled 不可用的
 * @param right 右边侧渲染
 * @param width 侧滑菜单宽度css，考虑到如何响应，如何换算
 * @param type 侧滑菜单类型
 *          ['fixDrawer'——固定侧滑面板，主面板滑动]
 *          ['fixContent'——固定主面板，侧滑面板滑动]
 *          ['noFixed'——一起滑动！]
 * @param swipeable 设置false停用手势触发
 * @param onScrollLock 字内容有滚动条时，锁定
 *
 * @event change toggle事件
 *
 * @slot drawer 侧滑面板的插槽
 * @slot content 主面板的插槽
 */
import create from "../utils/create-basic";
import touch from "../utils/mixins/touch";
import context from "../utils/context";
import { on, off, findEventScroll } from "../utils/even";

export default create({
    mixins: [touch],
    name: "drawer",
    props: {
        value: Boolean,
        disabled: Boolean,
        right: Boolean,
        width: {
            type: String,
            default: "30vw"
        },
        type: {
            type: String,
            default: "noFixed"
        },
        swipeable: {
            type: Boolean,
            default: true
        },
        onScrollLock: Boolean
    },
    data() {
        return {
            drawerStyle: {},
            contentStyle: {},
            maskStyle: {},
            hideMask: true,
            drawerWidth: 0,
            swipeTime: 200
        };
    },
    model: {
        prop: "value",
        event: "change"
    },
    mounted() {
        this.addEventListener();
    },
    activated() {
        this.addEventListener();
    },
    beforeDestroy() {
        this.removeEventListener();
    },
    deactivated() {
        this.removeEventListener();
    },
    methods: {
        addEventListener() {
            let _self = this;
            on(window, "orientationchange", () => {
                setTimeout(() => {
                    _self.toggle(_self.status);
                }, 100);
            });
        },
        removeEventListener() {
            let _self = this;
            off(window, "orientationchange", () => {
                setTimeout(() => {
                    _self.toggle(_self.status);
                }, 100);
            });
        },
        // 监听对应开始滑动时，是否有滚动条
        listenerHasScroll(e) {
            const { onScrollLock, right } = this;
            if (onScrollLock) {
                let findScroll = findEventScroll(e, this.$el);
                if (right) {
                    this.lock = findScroll.rightScrollLength != 0;
                } else {
                    this.lock = findScroll.leftScrollLength != 0;
                }
            } else {
                this.lock = false;
            }
        },
        handleTouchStart(e) {
            this.listenerHasScroll(e);
            const { disabled, lock, swipeable, drawerWidth } = this;
            if (!disabled && !lock && swipeable) {
                this.touchStart(e);
                this.drawerWidth = drawerWidth
                    ? drawerWidth
                    : this.$el.childNodes[0].clientWidth;
            }
        },
        handleTouchMove(e) {
            const {
                disabled,
                lock,
                swipeable,
                touch,
                right,
                drawerWidth
            } = this;
            if (!disabled && !lock && swipeable) {
                this.touchMove(e);
                if (touch.direction === "left" || touch.direction === "right") {
                    let reg = "\\((.+?)\\)";
                    let transform = this.$el.childNodes[0].style.transform;
                    let translate = transform
                        ? transform.match(reg)[1].split(",")
                        : [0, 0];
                    let elx = parseFloat(translate[0]);
                    let x = touch.stepX + elx;
                    if (right) {
                        x = x > 0 ? 0 : x < -drawerWidth ? -drawerWidth : x;
                    } else {
                        x = x < 0 ? 0 : x > drawerWidth ? drawerWidth : x;
                    }
                    this.drawerStyle.transitionProperty = "none";
                    this.contentStyle.transitionProperty = "none";
                    this.maskStyle.transitionProperty = "none";
                    this.translate(x);
                }
            }
        },
        handleTouchEnd(e) {
            const {
                disabled,
                lock,
                swipeable,
                touch,
                drawerWidth,
                right,
                status
            } = this;
            if (!disabled && !lock && swipeable) {
                this.touchEnd(e);
                let x = Math.abs(touch.deltaX);
                let w = drawerWidth / 2;
                if (right) {
                    if (touch.direction === "left") {
                        this.toggle(x > w ? true : status);
                    } else if (touch.direction === "right") {
                        this.toggle(x > w ? false : status);
                    }
                } else {
                    if (touch.direction === "right") {
                        this.toggle(x > w ? true : status);
                    } else if (touch.direction === "left") {
                        this.toggle(x > w ? false : status);
                    }
                }
            }
        },
        handerMaskClick() {
            if (this.status) {
                this.toggle(false);
            }
        },
        translate(x) {
            const { type, drawerWidth } = this;
            switch (type) {
                case "fixDrawer":
                    this.contentStyle.transform = `translate(${x}px,0px)`;
                    break;
                case "fixContent":
                    this.drawerStyle.transform = `translate(${x}px,0px)`;
                    break;
                default:
                    this.drawerStyle.transform = `translate(${x}px,0px)`;
                    this.contentStyle.transform = `translate(${x}px,0px)`;
                    break;
            }
            this.hideMask = x === 0;
            this.maskStyle.opacity = x / drawerWidth;
            this.$forceUpdate();
        },
        toggle(status) {
            this.drawerWidth = this.$el.childNodes[0].clientWidth;
            const { right, drawerWidth } = this;
            let x = status ? (right ? -drawerWidth : drawerWidth) : 0;
            this.drawerStyle.transitionProperty = "transform";
            this.contentStyle.transitionProperty = "transform";
            this.maskStyle.transitionProperty = "opacity";
            this.status = status;
            this.$emit("change", status);
            this.translate(x);
        }
    },
    watch: {
        value: {
            handler(val) {
                if (this.disabled) return;
                this.status = val;
                this.$nextTick(() => {
                    this.toggle(val);
                });
            },
            immediate: true
        },
        right() {
            this.toggle(this.status);
        },
        width() {
            this.$nextTick(() => {
                this.toggle(this.status);
            });
        }
    },
    render() {
        const {
            b,
            drawerStyle,
            contentStyle,
            maskStyle,
            width,
            right,
            type,
            hideMask,
            swipeTime
        } = this;

        let newDrawerStyle = Object.assign(
            {
                width: `${width}`,
                [right ? "right" : "left"]: `${
                    type === "fixDrawer" ? "0" : `-${width}`
                }`,
                zIndex:
                    type === "fixDrawer" ? context.zIndex : context.zIndex + 2,
                transitionDuration: `${swipeTime}ms`
            },
            drawerStyle
        );
        let newContentStyle = Object.assign(
            {
                zIndex:
                    type === "fixContent" ? context.zIndex : context.zIndex + 2,
                transitionDuration: `${swipeTime}ms`
            },
            contentStyle
        );

        let newMaskStyle = Object.assign(
            {
                zIndex:
                    type === "fixContent" ? context.zIndex : context.zIndex + 2,
                transitionDuration: "200ms"
            },
            maskStyle
        );

        return (
            <div class={b()}>
                <div
                    class={b("aside-warp")}
                    onTouchstart={this.handleTouchStart}
                    onTouchmove={this.handleTouchMove}
                    onTouchend={this.handleTouchEnd}
                    style={newDrawerStyle}
                >
                    {this.$slots.drawer}
                </div>
                <div
                    onTouchstart={this.handleTouchStart}
                    onTouchmove={this.handleTouchMove}
                    onTouchend={this.handleTouchEnd}
                    class={b("content-warp")}
                    style={newContentStyle}
                >
                    {this.$slots.content}
                    <div
                        class={b("content-mask", { hidden: hideMask })}
                        style={newMaskStyle}
                        onClick={this.handerMaskClick}
                    ></div>
                </div>
            </div>
        );
    }
});
