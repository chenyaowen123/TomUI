/**
 * 用于统一管理弹出层
 */
export default {
    zIndex: 2000, // 弹出层z-index管理，弹出层自增，并且更新的时候只增不减
    lockCount: 0, // 锁定背景不滚动的弹出窗数量，用于何时放开滚动条滚动
    scrollTop: -1, // -1代表没有检测过body的scrolltop
    Dialog: null // 全局dialog
};
