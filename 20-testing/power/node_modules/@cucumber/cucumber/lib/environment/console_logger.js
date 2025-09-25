"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const node_console_1 = require("node:console");
class ConsoleLogger {
    stream;
    debugEnabled;
    console;
    constructor(stream, debugEnabled) {
        this.stream = stream;
        this.debugEnabled = debugEnabled;
        this.console = new node_console_1.Console(this.stream);
    }
    debug(message, ...optionalParams) {
        if (this.debugEnabled) {
            this.console.debug(message, ...optionalParams);
        }
    }
    error(message, ...optionalParams) {
        this.console.error(message, ...optionalParams);
    }
    warn(message, ...optionalParams) {
        this.console.warn(message, ...optionalParams);
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=console_logger.js.map