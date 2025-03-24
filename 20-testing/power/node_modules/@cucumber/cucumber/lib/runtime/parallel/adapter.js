"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildProcessAdapter = void 0;
const node_child_process_1 = require("node:child_process");
const node_path_1 = __importDefault(require("node:path"));
const runWorkerPath = node_path_1.default.resolve(__dirname, 'run_worker.js');
class ChildProcessAdapter {
    environment;
    logger;
    eventBroadcaster;
    options;
    supportCodeLibrary;
    idleInterventions = 0;
    failing = false;
    onFinish;
    todo = [];
    inProgress = {};
    workers = {};
    constructor(environment, logger, eventBroadcaster, options, supportCodeLibrary) {
        this.environment = environment;
        this.logger = logger;
        this.eventBroadcaster = eventBroadcaster;
        this.options = options;
        this.supportCodeLibrary = supportCodeLibrary;
    }
    parseWorkerMessage(worker, message) {
        switch (message.type) {
            case 'READY':
                worker.state = 0 /* WorkerState.idle */;
                this.awakenWorkers(worker);
                break;
            case 'ENVELOPE':
                this.eventBroadcaster.emit('envelope', message.envelope);
                break;
            case 'FINISHED':
                if (!message.success) {
                    this.failing = true;
                }
                delete this.inProgress[worker.id];
                worker.state = 0 /* WorkerState.idle */;
                this.awakenWorkers(worker);
                break;
            default:
                throw new Error(`Unexpected message from worker: ${JSON.stringify(message)}`);
        }
    }
    awakenWorkers(triggeringWorker) {
        Object.values(this.workers).forEach((worker) => {
            if (worker.state === 0 /* WorkerState.idle */) {
                this.giveWork(worker);
            }
            return worker.state !== 0 /* WorkerState.idle */;
        });
        if (Object.keys(this.inProgress).length == 0 && this.todo.length > 0) {
            this.giveWork(triggeringWorker, true);
            this.idleInterventions++;
        }
    }
    startWorker(id, total) {
        const workerProcess = (0, node_child_process_1.fork)(runWorkerPath, [], {
            cwd: this.environment.cwd,
            env: {
                ...this.environment.env,
                CUCUMBER_PARALLEL: 'true',
                CUCUMBER_TOTAL_WORKERS: total.toString(),
                CUCUMBER_WORKER_ID: id,
            },
            stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
        });
        const worker = { state: 3 /* WorkerState.new */, process: workerProcess, id };
        this.workers[id] = worker;
        worker.process.on('message', (message) => {
            this.parseWorkerMessage(worker, message);
        });
        worker.process.on('close', (exitCode) => {
            worker.state = 1 /* WorkerState.closed */;
            this.onWorkerProcessClose(exitCode);
        });
        worker.process.send({
            type: 'INITIALIZE',
            supportCodeCoordinates: this.supportCodeLibrary.originalCoordinates,
            supportCodeIds: {
                stepDefinitionIds: this.supportCodeLibrary.stepDefinitions.map((s) => s.id),
                beforeTestCaseHookDefinitionIds: this.supportCodeLibrary.beforeTestCaseHookDefinitions.map((h) => h.id),
                afterTestCaseHookDefinitionIds: this.supportCodeLibrary.afterTestCaseHookDefinitions.map((h) => h.id),
            },
            options: this.options,
        });
    }
    onWorkerProcessClose(exitCode) {
        if (exitCode !== 0) {
            this.failing = true;
        }
        if (Object.values(this.workers).every((x) => x.state === 1 /* WorkerState.closed */)) {
            this.onFinish(!this.failing);
        }
    }
    async run(assembledTestCases) {
        this.todo = Array.from(assembledTestCases);
        return await new Promise((resolve) => {
            for (let i = 0; i < this.options.parallel; i++) {
                this.startWorker(i.toString(), this.options.parallel);
            }
            this.onFinish = (status) => {
                if (this.idleInterventions > 0) {
                    this.logger.warn(`WARNING: All workers went idle ${this.idleInterventions} time(s). Consider revising handler passed to setParallelCanAssign.`);
                }
                resolve(status);
            };
        });
    }
    nextWorkPlacement() {
        for (let index = 0; index < this.todo.length; index++) {
            const placement = this.placementAt(index);
            if (this.supportCodeLibrary.parallelCanAssign(placement.item.pickle, Object.values(this.inProgress).map(({ pickle }) => pickle))) {
                return placement;
            }
        }
        return null;
    }
    placementAt(index) {
        return {
            index,
            item: this.todo[index],
        };
    }
    giveWork(worker, force = false) {
        if (this.todo.length < 1) {
            worker.state = 2 /* WorkerState.running */;
            worker.process.send({ type: 'FINALIZE' });
            return;
        }
        const workPlacement = force ? this.placementAt(0) : this.nextWorkPlacement();
        if (workPlacement === null) {
            return;
        }
        const { index: nextIndex, item } = workPlacement;
        this.todo.splice(nextIndex, 1);
        this.inProgress[worker.id] = item;
        worker.state = 2 /* WorkerState.running */;
        worker.process.send({
            type: 'RUN',
            assembledTestCase: item,
            failing: this.failing,
        });
    }
}
exports.ChildProcessAdapter = ChildProcessAdapter;
//# sourceMappingURL=adapter.js.map