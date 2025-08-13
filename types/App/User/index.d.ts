declare namespace _default {
    export { UserApp as App };
    export { UserUI as UI };
    export let Command: {
        Message: typeof import("./Command/Message.js").default;
        Options: typeof import("./Command/Options.js").default;
        Args: typeof import("../Command/Args.js").default;
    };
}
export default _default;
import UserApp from "./UserApp.js";
import UserUI from "./UserUI.js";
export { UserApp, UserUI };
