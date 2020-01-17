/**
 * 下拉刷新
 */
export default {
    data() {
        return {
            hasLoadingTop: false,
            hasloadingBottom: false,
            loadingTop: false,
            loadingBottom: false,
            loadingTopStyle: {},
            loadingBottomStyle: {}
        };
    },
    methods: {
        touchMove_pullLoading() {
            const { pullTop, pullBottom, position } = this;
            if (pullTop && position.top && position.lateTop > 0) {
                this.loadingTopStyle = {
                    top: (position.lateTop + 44) / 2 + "px",
                    transitionDuration: "0ms"
                };
                this.hasLoadingTop = position.lateTop >= 60;
            }
            if (pullBottom && position.bottom && position.lateBottom > 0) {
                this.loadingBottomStyle = {
                    bottom: (position.lateBottom + 44) / 2 + "px",
                    transitionDuration: "0ms"
                };
                this.hasloadingBottom = position.lateBottom >= 60;
            }
        },
        touchEnd_pullLoadingOpen() {
            const {
                pullTop,
                pullBottom,
                hasLoadingTop,
                loadingTop,
                hasloadingBottom,
                loadingBottom
            } = this;

            if (pullTop && hasLoadingTop && !loadingTop) {
                this.hasLoadingTop = false;
                this.loadingTop = true;
                this.loadingTopStyle = {
                    top: "56px",
                    transitionDuration: "200ms"
                };
                this.$emit("pulldown", () => {
                    this.loadingTop = false;
                    this.loadingTopStyle = {
                        top: 0,
                        transitionDuration: "200ms"
                    };
                });
            } else {
                this.loadingTop = false;
                this.loadingTopStyle = {
                    top: 0,
                    transitionDuration: "200ms"
                };
            }

            if (pullBottom && hasloadingBottom && !loadingBottom) {
                this.hasloadingBottom = false;
                this.loadingBottom = true;
                this.loadingBottomStyle = {
                    bottom: "56px",
                    transitionDuration: "200ms"
                };
                this.$emit("pullup", () => {
                    this.loadingBottom = false;
                    this.loadingBottomStyle = {
                        bottom: 0,
                        transitionDuration: "200ms"
                    };
                });
            } else {
                this.loadingBottom = false;
                this.loadingBottomStyle = {
                    bottom: 0,
                    transitionDuration: "200ms"
                };
            }
        }
    }
};
