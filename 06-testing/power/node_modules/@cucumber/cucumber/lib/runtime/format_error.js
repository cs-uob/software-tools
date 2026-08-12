"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = void 0;
const assertion_error_formatter_1 = require("assertion-error-formatter");
const error_stack_parser_1 = __importDefault(require("error-stack-parser"));
const filter_stack_trace_1 = require("../filter_stack_trace");
function formatError(error, filterStackTraces) {
    let processedStackTrace;
    try {
        const parsedStack = error_stack_parser_1.default.parse(error);
        const filteredStack = filterStackTraces
            ? (0, filter_stack_trace_1.filterStackTrace)(parsedStack)
            : parsedStack;
        processedStackTrace = filteredStack.map((f) => f.source).join('\n');
    }
    catch {
        // if we weren't able to parse and process, we'll settle for the original
    }
    const message = (0, assertion_error_formatter_1.format)(error, {
        colorFns: {
            errorStack: (stack) => {
                return processedStackTrace ? `\n${processedStackTrace}` : stack;
            },
        },
    });
    return {
        message,
        exception: {
            type: error.name || 'Error',
            message: typeof error === 'string' ? error : error.message,
            stackTrace: processedStackTrace ?? error.stack,
        },
    };
}
exports.formatError = formatError;
//# sourceMappingURL=format_error.js.map