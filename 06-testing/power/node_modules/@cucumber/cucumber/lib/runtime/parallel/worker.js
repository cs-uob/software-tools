"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildProcessWorker = void 0;
const node_events_1 = require("node:events");
const node_url_1 = require("node:url");
const node_module_1 = require("node:module");
const messages_1 = require("@cucumber/messages");
const support_code_library_builder_1 = __importDefault(require("../../support_code_library_builder"));
const try_require_1 = __importDefault(require("../../try_require"));
const worker_1 = require("../worker");
const { uuid } = messages_1.IdGenerator;
class ChildProcessWorker {
    cwd;
    exit;
    id;
    eventBroadcaster;
    newId;
    sendMessage;
    options;
    supportCodeLibrary;
    worker;
    constructor({ cwd, exit, id, sendMessage, }) {
        this.id = id;
        this.newId = uuid();
        this.cwd = cwd;
        this.exit = exit;
        this.sendMessage = sendMessage;
        this.eventBroadcaster = new node_events_1.EventEmitter();
        this.eventBroadcaster.on('envelope', (envelope) => this.sendMessage({ type: 'ENVELOPE', envelope }));
    }
    async initialize({ supportCodeCoordinates, supportCodeIds, options, }) {
        support_code_library_builder_1.default.reset(this.cwd, this.newId, supportCodeCoordinates);
        supportCodeCoordinates.requireModules.map((module) => (0, try_require_1.default)(module));
        supportCodeCoordinates.requirePaths.map((module) => (0, try_require_1.default)(module));
        for (const specifier of supportCodeCoordinates.loaders) {
            (0, node_module_1.register)(specifier, (0, node_url_1.pathToFileURL)('./'));
        }
        for (const path of supportCodeCoordinates.importPaths) {
            await import((0, node_url_1.pathToFileURL)(path).toString());
        }
        this.supportCodeLibrary = support_code_library_builder_1.default.finalize(supportCodeIds);
        this.options = options;
        this.worker = new worker_1.Worker(this.id, this.eventBroadcaster, this.newId, this.options, this.supportCodeLibrary);
        await this.worker.runBeforeAllHooks();
        this.sendMessage({ type: 'READY' });
    }
    async finalize() {
        await this.worker.runAfterAllHooks();
        this.exit(0);
    }
    async receiveMessage(command) {
        switch (command.type) {
            case 'INITIALIZE':
                await this.initialize(command);
                break;
            case 'RUN':
                await this.runTestCase(command);
                break;
            case 'FINALIZE':
                await this.finalize();
                break;
        }
    }
    async runTestCase(command) {
        const success = await this.worker.runTestCase(command.assembledTestCase, command.failing);
        this.sendMessage({
            type: 'FINISHED',
            success,
        });
    }
}
exports.ChildProcessWorker = ChildProcessWorker;
//# sourceMappingURL=worker.js.map