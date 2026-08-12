"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const value_checker_1 = require("../../value_checker");
const worker_1 = require("./worker");
function run() {
    const exit = (exitCode, error, message) => {
        if ((0, value_checker_1.doesHaveValue)(error)) {
            console.error(new Error(message, { cause: error })); // eslint-disable-line no-console
        }
        process.exit(exitCode);
    };
    const worker = new worker_1.ChildProcessWorker({
        id: process.env.CUCUMBER_WORKER_ID,
        sendMessage: (message) => process.send(message),
        cwd: process.cwd(),
        exit,
    });
    process.on('message', (m) => {
        worker
            .receiveMessage(m)
            .catch((error) => exit(1, error, 'Unexpected error on worker.receiveMessage'));
    });
}
run();
//# sourceMappingURL=run_worker.js.map