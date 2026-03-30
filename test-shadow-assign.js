import { Model } from '@nan0web/core'
export class TestModel extends Model {
    static options = [];
    constructor(data = {}) {
        super(data);
        /** @type {string[]} */ this.options;
    }
    run() {
        this.options = ["foo"];
    }
}
