/**
 * 这是一个可以自定义错误页面的文件
 * @param title      不可用的
 * @param text         宽度
 * @param buttonText        高度
 * @param buttonType         v-model
 * @param buttonColor   下拉时候的提示文字
 * @param countdown   达到下拉触发阈值时提示文字
 * @param themeColor   loading刷新时的文字
 *
 * @event buttonClick       按钮点击
 * @event end          倒计时结束
 *
 */
import create from "../utils/create";
export default create({
    name: "error",
    props: {
        title: {
            type: String,
            default: "404错误！"
        },
        text: {
            type: String,
            default: "页面丢失了哦！"
        },
        buttonText: {
            type: String,
            default: "返回"
        },
        buttonType: {
            type: String,
            default: "danger"
        },
        buttonColor: String,
        countdown: [String, Number],
        themeColor: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            hasCount: false,
            count: -1,
            countText: ""
        };
    },
    mounted() {
        let value = parseInt(this.countdown);
        if (typeof value === "number" && !isNaN(value) && value > 0) {
            this.count = value;
            this.hasCount = true;
            let interval = setInterval(() => {
                if (this.count === 1) {
                    clearInterval(interval);
                    this.$emit("end");
                    this.count = -1;
                    this.countText = `正在跳转...`;
                } else {
                    this.count--;
                    this.countText = `${this.count}S后跳转`;
                }
            }, 1000);
        }
    },
    render() {
        const {
            themeColor,
            title,
            countText,
            buttonText,
            buttonType,
            buttonColor,
            hasCount,
            b
        } = this;
        let background = {};
        let borderColor = {};
        if (themeColor) {
            background = { background: themeColor };
            borderColor = { borderColor: themeColor };
        }
        return (
            <div class={b()} style={background}>
                <div class={b("ghost")}>
                    <div class={b("symbol")}></div>
                    <div class={b("symbol")}></div>
                    <div class={b("symbol")}></div>
                    <div class={b("symbol")}></div>
                    <div class={b("symbol")}></div>
                    <div class={b("symbol")}></div>

                    <div class={b("ghost-container")}>
                        <div class={b("ghost-eyes")}>
                            <div class={b("eye-left")} style={background}></div>
                            <div
                                class={b("eye-right")}
                                style={background}
                            ></div>
                        </div>
                        <div class={b("ghost-bottom")}>
                            <div></div>
                            <div style={borderColor}></div>
                            <div></div>
                            <div style={borderColor}></div>
                            <div></div>
                        </div>
                    </div>
                    <div class={b("ghost-shadow")}></div>
                </div>

                <div class={b("description")}>
                    <div class={b("description-container")}>
                        <div class={b("description-title")}>{title}</div>
                        <div class={b("description-text")}>
                            页面丢失了哦！
                            <font vShow={hasCount}> {countText} </font>
                        </div>
                    </div>
                    <tom-button
                        type={buttonType}
                        round="ring"
                        color={buttonColor}
                        class={b("button")}
                        onClick={e => this.$emit("buttonClick", e)}
                    >
                        {buttonText}
                    </tom-button>
                </div>
            </div>
        );
    }
});
