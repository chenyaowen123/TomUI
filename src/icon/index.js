/**
 * @param name        icon图标名称
 * @param rotate      是否旋转图标
 *
 * @event click       点击事件
 */
import create from "../utils/create-basic";
export default create({
    name: "icon",
    props: {
        name: String,
        rotate: Boolean
    },
    render() {
        return (
            <i
                class={[
                    `tom-icon-${this.name}`,
                    this.b({ rotate: this.rotate })
                ]}
                onClick={e => this.$emit("click", e)}
            ></i>
        );
    }
});
