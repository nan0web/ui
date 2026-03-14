/**
 * @typedef {Object} TreeNode
 * @property {string} label
 * @property {boolean} [expanded]
 * @property {TreeNode[]} [children]
 */
/**
 * @typedef {Object} TreeData
 * @property {TreeNode[]} [data]
 */
/**
 * Model-as-Schema for Tree component.
 * Represents a hierarchical selection or navigation structure.
 */
export class TreeModel {
    static data: {
        help: string;
        type: string;
        default: never[];
    };
    /**
     * @param {TreeData} [data]
     */
    constructor(data?: TreeData);
    /** @type {TreeNode[]|undefined} */ data: TreeNode[] | undefined;
    run(): AsyncGenerator<{
        type: string;
        field: string;
        schema: {
            help: string;
        };
        component: string;
        model: any;
    }, {
        type: string;
        data: {
            selected: any;
        };
    }, unknown>;
}
export type TreeNode = {
    label: string;
    expanded?: boolean | undefined;
    children?: TreeNode[] | undefined;
};
export type TreeData = {
    data?: TreeNode[] | undefined;
};
