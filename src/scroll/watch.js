/**
 * 该文件是混入监听，根据内容变化，监听滚动元素的宽高变化，自动执行刷新定位
 * 如果不兼容，后续可以用（resize-observer-polyfill）插件试试
 */
import { mutationObserverSupport, mutationObserver } from "../utils/even";
export default {
    data() {
        return {
            mutationEl: null, // 监听对象
            mutation: null, // 监听
            size: {
                width: 0,
                height: 0
            }
        };
    },
    mounted() {
        this.mutationEl = this.$el.childNodes[0];
        if (mutationObserverSupport) {
            this.addMutation();
        }
        this.getSize();
    },
    activated() {
        if (mutationObserverSupport) {
            this.addMutation();
        }
    },
    beforeDestroy() {
        if (mutationObserverSupport) {
            this.removeMutation();
        }
    },
    deactivated() {
        if (mutationObserverSupport) {
            this.removeMutation();
        }
    },
    methods: {
        addMutation() {
            let _self = this;
            if (!this.mutation) {
                this.mutation = new mutationObserver(function() {
                    _self.chickResize();
                });
            }
            this.mutation.observe(this.mutationEl, {
                childList: true,
                attributes: true,
                characterData: true,
                subtree: true
            });
        },
        removeMutation() {
            this.mutation.takeRecords();
            this.mutation.disconnect();
        },
        getSize() {
            this.size = {
                width: this.mutationEl.clientWidth,
                height: this.mutationEl.clientHeight
            };
        },
        chickResize() {
            let oldSize = Object.assign({}, this.size);
            this.getSize();
            if (
                oldSize.width != this.size.width ||
                oldSize.height != this.size.height
            ) {
                this.refresh();
            }
        }
    }
};
