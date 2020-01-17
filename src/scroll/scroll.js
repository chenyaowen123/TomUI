/**
 * 主内容偏移，滚动条偏移等
 */
export default {
    data() {
        return {
            ratio: 0.4,
            duration: 1000,
            resetDuration: 200,
            scrollStyleY: {},
            scrollStyleX: {},
            showScrollY: true,
            showScrollX: true
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.setScrollBar(0, 0, 0);
        });
    },
    methods: {
        touchStart_translate() {
            this.contentStyle.transitionProperty = "none";
            this.contentStyle.transitionDuration = "0ms";
            this.scrollStyleX.transitionProperty = "none";
            this.scrollStyleX.transitionDuration = "0ms";
            this.scrollStyleY.transitionProperty = "none";
            this.scrollStyleY.transitionDuration = "0ms";
        },
        touchMove_translate() {
            const { position, touch, ratio } = this;
            let ratioX = position.left || position.right ? ratio / 4 : 1,
                ratioY = position.top || position.bottom ? ratio : 1;
            let x = position.x + touch.stepX * ratioX || 0,
                y = position.y + touch.stepY * ratioY || 0;

            this.contentStyle = {
                transitionProperty: "transform",
                transitionDuration: "0ms",
                transform: `translate(${x}px,${y}px)`
            };
            this.setScrollBar(x, y, 0);
        },
        touchEnd_translate() {
            const { touch, position, duration } = this;
            let offsetX = parseInt(Math.abs(touch.deltaX));
            let offsetY = parseInt(Math.abs(touch.deltaY));
            if (offsetX > 1 || offsetY > 1) {
                let Vx = touch.velocityX;
                let Vy = touch.velocityY;
                if (Vx != 0 || Vy != 0) {
                    let x = Vx * 300 + position.x;
                    let y = Vy * 300 + position.y;
                    if (x > 0) {
                        x = Vx;
                    }
                    if (x < position.atRight) {
                        x = position.atRight + Vx;
                    }
                    if (y > 0) {
                        y = Vy;
                    }
                    if (y < position.atBottom) {
                        y = position.atBottom + Vy;
                    }
                    this.contentStyle = {
                        transitionProperty: "transform",
                        transitionDuration: `${duration}ms`,
                        transform: `translate(${x}px,${y}px)`
                    };
                    this.setScrollBar(x, y, duration);
                    setTimeout(() => {
                        this.resetPosition();
                    }, duration);
                } else {
                    this.resetPosition();
                }
            }
        },
        // 注意jsx不支持使用display
        setScrollBar(x, y, time) {
            let el = this.$el;
            let bodyEl = this.$el.childNodes[0];
            let lateY = parseInt((-y / bodyEl.clientHeight) * el.clientHeight);
            let lateX = parseInt((-x / bodyEl.clientWidth) * el.clientWidth);

            let height =
                el.clientHeight * (el.clientHeight / bodyEl.clientHeight) +
                "px";
            this.scrollStyleY = {
                height,
                transitionProperty: "transform",
                transitionDuration: `${time}ms`,
                transform: `translate(0px,${lateY}px)`
            };
            this.showScrollY = bodyEl.clientHeight > el.clientHeight;

            let width =
                el.clientWidth * (el.clientWidth / bodyEl.clientWidth) + "px";
            this.scrollStyleX = {
                width,
                transitionProperty: "transform",
                transitionDuration: `${time}ms`,
                transform: `translate(${lateX}px,0px)`
            };
            this.showScrollX = bodyEl.clientWidth > el.clientWidth;
        },
        resetPosition() {
            this.getPosition();
            const { position, resetDuration } = this;
            let x = position.x;
            let y = position.y;
            if (position.top) {
                y = 0;
                this.$emit("topside"); // 触顶
            }
            if (position.bottom) {
                y = position.atBottom;
                this.$emit("bottomside");
            }
            if (position.left) {
                x = 0;
                this.$emit("leftside");
            }
            if (position.right) {
                x = position.atRight;
                this.$emit("rightside");
            }
            this.contentStyle = {
                transitionProperty: "transform",
                transitionDuration: `${resetDuration}ms`,
                transform: `translate(${x}px,${y}px)`
            };
            this.setScrollBar(x, y, resetDuration);
        }
    }
};
