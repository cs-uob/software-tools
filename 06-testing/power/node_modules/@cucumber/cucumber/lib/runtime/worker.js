"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const test_case_runner_1 = __importDefault(require("./test_case_runner"));
const helpers_1 = require("./helpers");
const run_test_run_hooks_1 = require("./run_test_run_hooks");
class Worker {
    workerId;
    eventBroadcaster;
    newId;
    options;
    supportCodeLibrary;
    runTestRunHooks;
    constructor(workerId, eventBroadcaster, newId, options, supportCodeLibrary) {
        this.workerId = workerId;
        this.eventBroadcaster = eventBroadcaster;
        this.newId = newId;
        this.options = options;
        this.supportCodeLibrary = supportCodeLibrary;
        this.runTestRunHooks = (0, run_test_run_hooks_1.makeRunTestRunHooks)(this.options.dryRun, this.supportCodeLibrary.defaultTimeout, this.options.worldParameters, (name, location) => {
            let message = `${name} hook errored`;
            if (this.workerId) {
                message += ` on worker ${this.workerId}`;
            }
            message += `, process exiting: ${location}`;
            return message;
        });
    }
    async runBeforeAllHooks() {
        await this.runTestRunHooks(this.supportCodeLibrary.beforeTestRunHookDefinitions, 'a BeforeAll');
    }
    async runTestCase({ gherkinDocument, pickle, testCase }, failing) {
        const testCaseRunner = new test_case_runner_1.default({
            workerId: this.workerId,
            eventBroadcaster: this.eventBroadcaster,
            newId: this.newId,
            gherkinDocument,
            pickle,
            testCase,
            retries: (0, helpers_1.retriesForPickle)(pickle, this.options),
            skip: this.options.dryRun || (this.options.failFast && failing),
            filterStackTraces: this.options.filterStacktraces,
            supportCodeLibrary: this.supportCodeLibrary,
            worldParameters: this.options.worldParameters,
        });
        const status = await testCaseRunner.run();
        return !(0, helpers_1.shouldCauseFailure)(status, this.options);
    }
    async runAfterAllHooks() {
        await this.runTestRunHooks(this.supportCodeLibrary.afterTestRunHookDefinitions.slice(0).reverse(), 'an AfterAll');
    }
}
exports.Worker = Worker;
//# sourceMappingURL=worker.js.map