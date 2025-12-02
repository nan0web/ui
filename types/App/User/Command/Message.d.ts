export class DepsCommand extends UIMessage {
    static Body: typeof DepsCommandParams;
    constructor(input?: {});
    /** @type {DepsCommandParams} */
    body: DepsCommandParams;
}
export default DepsCommand;
import UIMessage from "../../../core/Message/Message.js";
declare class DepsCommandParams {
    static fix: {
        help: string;
        defaultValue: boolean;
    };
    constructor(input?: {});
    fix: boolean;
}
