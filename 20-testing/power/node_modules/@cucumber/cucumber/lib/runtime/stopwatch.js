"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = exports.create = void 0;
const messages_1 = require("@cucumber/messages");
const time_1 = __importDefault(require("../time"));
class StopwatchImpl {
    base;
    started;
    constructor(base = { seconds: 0, nanos: 0 }) {
        this.base = base;
    }
    start() {
        this.started = time_1.default.performance.now();
        return this;
    }
    stop() {
        this.base = this.duration();
        this.started = undefined;
        return this;
    }
    duration() {
        if (typeof this.started !== 'number') {
            return this.base;
        }
        return messages_1.TimeConversion.addDurations(this.base, messages_1.TimeConversion.millisecondsToDuration(time_1.default.performance.now() - this.started));
    }
}
const create = (base) => new StopwatchImpl(base);
exports.create = create;
const timestamp = () => messages_1.TimeConversion.millisecondsSinceEpochToTimestamp(time_1.default.Date.now());
exports.timestamp = timestamp;
//# sourceMappingURL=stopwatch.js.map