"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_formatter_1 = __importDefault(require("../json_formatter"));
const progress_bar_formatter_1 = __importDefault(require("../progress_bar_formatter"));
const progress_formatter_1 = __importDefault(require("../progress_formatter"));
const rerun_formatter_1 = __importDefault(require("../rerun_formatter"));
const snippets_formatter_1 = __importDefault(require("../snippets_formatter"));
const summary_formatter_1 = __importDefault(require("../summary_formatter"));
const usage_formatter_1 = __importDefault(require("../usage_formatter"));
const usage_json_formatter_1 = __importDefault(require("../usage_json_formatter"));
const Formatters = {
    getFormatters() {
        return {
            json: json_formatter_1.default,
            progress: progress_formatter_1.default,
            'progress-bar': progress_bar_formatter_1.default,
            rerun: rerun_formatter_1.default,
            snippets: snippets_formatter_1.default,
            summary: summary_formatter_1.default,
            usage: usage_formatter_1.default,
            'usage-json': usage_json_formatter_1.default,
        };
    },
};
exports.default = Formatters;
//# sourceMappingURL=formatters.js.map