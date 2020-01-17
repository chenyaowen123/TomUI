/**
 * scroll 滚动条，下拉刷新，上拉加载
 * @param width                 宽度
 * @param height                高度
 * @param background            背景颜色，默认白色
 * @param pullTop               下拉加载
 * @param pullBottom            上拉加载
 * @param topPullText           下拉刷新文字
 * @param topLoadingText        顶部加载文字
 * @param bottomPullText        上拉加载文字
 * @param bottomLoadingText     底部loading文字
 * @param stylex                scroll 滚动条x轴样式
 * @param styley                scroll 滚动条y轴样式
 *
 * @event pulldown              下拉事件
 * @event pullup                上拉事件
 * @event topside               触顶事件
 * @event bottomside            触底事件
 * @event leftside              左触顶事件
 * @event rightside             右触底事件
 */
import create from "../utils/create";
import touch from "../utils/mixins/touch";
import scroll from "./scroll";
import pull from "./pull";
import watch from "./watch";

export default create({
    mixins: [touch, scroll, pull, watch],
    name: "scroll",
    props: {
        width: String,
        height: String,
        background: String,
        pullTop: {
            type: Boolean,
            default: false
        },
        pullBottom: {
            type: Boolean,
            default: false
        },
        topPullText: {
            type: String,
            default: "下拉刷新..."
        },
        topLoadingText: {
            type: String,
            default: "正在刷新..."
        },
        bottomPullText: {
            type: String,
            default: "上拉加载..."
        },
        bottomLoadingText: {
            type: String,
            default: "正在加载..."
        },
        stylex: Object,
        styley: Object
    },
    data() {
        return {
            contentStyle: {},
            position: {
                atBottom: 0,
                atRight: 0,
                x: 0,
                y: 0,
                left: false,
                right: false,
                top: false,
                bottom: false
            }
        };
    },
    methods: {
        handleTouchstart(e) {
            this.touchStart(e);
            this.touchStart_translate();
        },
        handleTouchmove(e) {
            e.preventDefault();
            this.touchMove(e);
            this.getPosition();
            this.touchMove_translate();
            this.touchMove_pullLoading();
        },
        handleTouchend(e) {
            this.touchEnd(e);
            this.touchEnd_translate();
            this.touchEnd_pullLoadingOpen();
        },
        getPosition() {
            let el = this.$el;
            let bodyEl = this.$el.childNodes[0];
            let reg = "\\((.+?)\\)";
            let transform = bodyEl.style.transform
                ? bodyEl.style.transform.match(reg)[1].split(",")
                : [0, 0];
            let x = parseFloat(transform[0]);
            let y = parseFloat(transform[1]);
            let position = {
                atBottom: el.clientHeight - bodyEl.clientHeight,
                atRight: el.clientWidth - bodyEl.clientWidth,
                x: parseFloat(transform[0] || 0),
                y: parseFloat(transform[1] || 0),
                left: x >= 0,
                right: el.clientWidth - x >= bodyEl.clientWidth,
                top: y >= 0,
                bottom: el.clientHeight - y >= bodyEl.clientHeight
            };
            position.lateTop = position.top ? y : 0;
            position.lateBottom = position.bottom
                ? el.clientHeight - y - bodyEl.clientHeight
                : 0;
            this.position = position;
        },
        refresh() {
            this.resetPosition();
        }
    },
    render() {
        const { width, height, background, b } = this;
        return (
            <div style={{ width, height }} class={b()}>
                <div
                    style={Object.assign({ background }, this.contentStyle)}
                    class={b("scroll-content")}
                    onTouchstart={this.handleTouchstart}
                    onTouchmove={this.handleTouchmove}
                    onTouchend={this.handleTouchend}
                >
                    {this.$slots.default}
                </div>
                <div
                    vShow={this.showScrollY}
                    style={Object.assign({}, this.styley, this.scrollStyleY)}
                    class={b("scroll-y")}
                ></div>
                <div
                    vShow={this.showScrollX}
                    style={Object.assign({}, this.stylex, this.scrollStyleX)}
                    class={b("scroll-x")}
                ></div>
                <span style={this.loadingTopStyle} class={b("loading-top")}>
                    <tom-icon name="redo" rotate={this.loadingTop}></tom-icon>
                    <font>
                        {this.loadingTop
                            ? this.topLoadingText
                            : this.topPullText}
                    </font>
                </span>
                <span
                    style={this.loadingBottomStyle}
                    class={b("loading-bottom")}
                >
                    <tom-icon
                        name="redo"
                        rotate={this.loadingBottom}
                    ></tom-icon>
                    <font>
                        {this.loadingBottom
                            ? this.bottomLoadingText
                            : this.bottomPullText}
                    </font>
                </span>
                <transition name="tom-fade">
                    <div
                        vShow={this.loadingTop || this.loadingBottom}
                        class={b("overlay")}
                        onTouchmove={e => {
                            e.preventDefault();
                        }}
                    ></div>
                </transition>
            </div>
        );
    }
});
