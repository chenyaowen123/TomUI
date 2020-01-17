export default {
    prefix: "tom-",
    zIndex: 2000, // 弹出层z-index管理，弹出层自增，并且更新的时候只增不减
    lockCount: 0, // 锁定背景不滚动的弹出窗数量，用于何时放开滚动条滚动
    stack: [] // 弹出背景层并且为显示的
};
