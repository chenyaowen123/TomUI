/**
 * 拓展指令式的dialog
 * 1.指令式的dialog统一在body下，而且只能显示一个，以最后一个为准
 * 2.分别拓展了，alert confirm close getStatus 四个函数
 */
import dialog from "./dialog";

let instance;
function isInDocument(element) {
    return document.body.contains(element);
}

function initInstance(Vue) {
    if (instance) {
        instance.$destroy();
    }
    instance = new (Vue.extend(dialog))({
        el: document.createElement("div"),
        propsData: {}
    });
}

let defaultOptions = {
    show: Boolean,
    title: "",
    width: "320px",
    content: "",
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    transition: "tom-dialog-bounce",
    duration: 0.3,
    round: true,
    safeAreaInsetBottom: true,
    getContainer: "body",
    asyncClose: false
};

const newDialog = options => {
    return new Promise((resolve, reject) => {
        if (!instance || !isInDocument(instance.$el)) {
            initInstance(this);
        }
        Object.assign(instance, defaultOptions, options, {
            resolve,
            reject
        });
    });
};

newDialog.alert = newDialog;

newDialog.confirm = options =>
    newDialog({
        showCancelButton: true,
        showConfirmButton: true,
        // asyncClose: true,
        ...options
    });

newDialog.close = () => {
    if (instance) {
        instance.doClose();
    }
};

newDialog.getStatus = () => {
    if (instance) {
        return instance.value;
    } else {
        return null;
    }
};
export default newDialog;
