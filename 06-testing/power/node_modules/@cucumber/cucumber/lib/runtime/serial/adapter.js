"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InProcessAdapter = void 0;
const worker_1 = require("../worker");
class InProcessAdapter {
    worker;
    failing = false;
    constructor(eventBroadcaster, newId, options, supportCodeLibrary) {
        this.worker = new worker_1.Worker(undefined, eventBroadcaster, newId, options, supportCodeLibrary);
    }
    async run(assembledTestCases) {
        await this.worker.runBeforeAllHooks();
        for (const item of assembledTestCases) {
            const success = await this.worker.runTestCase(item, this.failing);
            if (!success) {
                this.failing = true;
            }
        }
        await this.worker.runAfterAllHooks();
        return !this.failing;
    }
}
exports.InProcessAdapter = InProcessAdapter;
//# sourceMappingURL=adapter.js.map