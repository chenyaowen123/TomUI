import dialog from "./dialog";
import directiveDialog from "./directiveDialog";
dialog.beforInstall = Vue => {
    Vue.prototype.$dialog = directiveDialog;
};
export default dialog;
