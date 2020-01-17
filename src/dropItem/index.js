/**
 * 下拉按钮选项
 * @param options               列表 {title,value,disabled}
 * @param title                 标题
 * @param value                 v-model
 * @param show                  显示隐藏，.sync 双向绑定的
 *
 * @event change                value改变事件
 * @event open                  打开事件
 * @event close                 关闭事件
 *
 */
import create from "../utils/create-basic";
import tomMask from "../mask/index";
import { on, off } from "../utils/even";

export default create({
    name: "dropItem",
    props: {
        options: Array,
        title: String,
        value: [String, Number],
        show: Boolean,
        disabled: Boolean
    },
    data() {
        return {
            status: false,
            focus: false
        };
    },
    model: {
        prop: "value",
        event: "change"
    },
    components: {
        tomMask
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
                    _self.$forceUpdate();
                }, 100);
            });
        },
        removeEventListener() {
            let _self = this;
            off(window, "orientationchange", () => {
                setTimeout(() => {
                    _self.$forceUpdate();
                }, 100);
            });
        }
    },
    watch: {
        show: {
            handler(val) {
                this.status = this.disabled ? false : val ? true : false;
            }
        },
        status: {
            handler(val) {
                this.$el.focus();
                this.$emit("update:show", val);
                val ? this.$emit("open") : this.$emit("close");
            }
        }
    },
    render() {
        const { b, title, options } = this;
        let parent = this.$parent;
        let direction = parent.direction;

        let style = {};
        let contentStyle = {};
        let transitionName =
            direction === "up"
                ? "tom-dropItem-slide-bottom"
                : "tom-dropItem-slide-top";
        let top = parent.$el ? parent.$el.getBoundingClientRect().top : 0;
        let bodyheight = document.documentElement.clientHeight;
        if (direction === "up") {
            style.bottom = `${bodyheight - top}px`;
            style.top = 0;
            contentStyle.bottom = 0;
        } else {
            style.top = `${top + 50}px`;
            style.bottom = 0;
            contentStyle.bottom = "auto";
        }

        let newTitle = title;
        for (let i = 0; i < options.length; i++) {
            let item = options[i];
            if (item.value === this.value) {
                newTitle = item.title ? item.title : title;
                break;
            }
        }

        const Options = this.options.map(option => {
            const active = option.value === this.value;
            return (
                <div
                    class={[
                        "tom-hairline--bottom",
                        b("item", { active: active, disabled: option.disabled })
                    ]}
                    onClick={() => {
                        if (option.disabled) return;
                        this.status = false;
                        if (option.value !== this.value)
                            this.$emit("change", option.value);
                    }}
                >
                    <div class={b("item__title")}>{option.title}</div>
                    <div class={b("item__icon")}>
                        {active && <tom-icon name="check"></tom-icon>}
                    </div>
                </div>
            );
        });

        return (
            <div
                class={[b(), "tom-hairline--top-bottom"]}
                onFocus={() => {
                    this.focus = true;
                }}
                onBlur={() => {
                    this.focus = false;
                    if (this.$parent.closeOnClickOutside) this.status = false;
                }}
                tabindex="0"
            >
                <div
                    class={b("title", {
                        focus: this.focus,
                        disabled: this.disabled
                    })}
                    onClick={() => {
                        if (this.disabled) return;
                        let oldStatus = this.status;
                        this.status = !oldStatus;
                    }}
                >
                    {newTitle}
                    <tom-icon
                        name={this.status ? "caret-up" : "caret-down"}
                    ></tom-icon>
                </div>
                <tom-mask
                    duration={0.3}
                    show={this.status}
                    contentClass={b("content")}
                    contentStyle={contentStyle}
                    transition={transitionName}
                    style={style}
                    onMaskClick={() => {
                        if (this.$parent.closeOnClickMask) {
                            this.status = false;
                        }
                    }}
                >
                    {Options}
                    {this.$slots.default}
                </tom-mask>
            </div>
        );
    }
});
