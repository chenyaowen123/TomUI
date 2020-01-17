/**
 * touch.js 提供touch相关参数
 * @param begin     开始时间戳
 * @param end       结束时间戳
 * @param timeDiff  手势用时
 * @param startX    start开始坐标
 * @param startY    start开始坐标
 * @param stepX     move步进
 * @param stepY     move步进
 * @param deltaX    偏移量
 * @param deltaY    偏移量
 * @param velocityX 横向滑动速度
 * @param velocityY 竖直滑动速度
 * @param direction 滑动方向
 */
const MIN_DISTANCE = 6;
function getDirection(x, y) {
    if (Math.abs(x) > MIN_DISTANCE || Math.abs(y) > MIN_DISTANCE) {
        let ag = (Math.atan2(y, x) * 180) / Math.PI;
        if (ag >= -45 && ag < 45) {
            return "right";
        } else if (ag >= 45 && ag < 135) {
            return "down";
        } else if (ag >= -135 && ag < -45) {
            return "up";
        } else if ((ag >= 135 && ag <= 180) || (ag >= -180 && ag < -135)) {
            return "left";
        }
    }
    return "";
}
export default {
    data() {
        return {
            touch: {
                begin: null,
                end: null,
                timeDiff: 0,
                startX: null,
                startY: null,
                stepX: 0,
                stepY: 0,
                deltaX: 0,
                deltaY: 0,
                velocityX: 0,
                velocityY: 0,
                direction: ""
            }
        };
    },

    methods: {
        touchStart(event) {
            this.resetTouchStatus();
            const { touch } = this;
            touch.startX = event.touches[0].clientX;
            touch.startY = event.touches[0].clientY;
            touch.begin = new Date().getTime();
        },
        touchMove(event) {
            const eventouch = event.touches[0];
            const { touch } = this;
            let oldDeltaX = this.touch.deltaX;
            let oldDeltaY = this.touch.deltaY;
            touch.deltaX = eventouch.clientX - touch.startX;
            touch.deltaY = eventouch.clientY - touch.startY;
            touch.stepX = touch.deltaX - oldDeltaX;
            touch.stepY = touch.deltaY - oldDeltaY;
            touch.direction =
                touch.direction || getDirection(touch.deltaX, touch.deltaY);
        },
        touchEnd() {
            const { touch } = this;
            touch.end = new Date().getTime();
            touch.timeDiff = touch.end - touch.begin;
            if (touch.timeDiff < 1000) {
                touch.velocityX = touch.deltaX / touch.timeDiff;
                touch.velocityY = touch.deltaY / touch.timeDiff;
            } else {
                touch.velocityX = 0;
                touch.velocityY = 0;
            }
        },
        resetTouchStatus() {
            const { touch } = this;
            touch.end = null;
            touch.deltaX = 0;
            touch.deltaY = 0;
            touch.direction = "";
        }
    }
};
