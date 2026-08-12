"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCode = void 0;
const node_url_1 = require("node:url");
const node_path_1 = __importDefault(require("node:path"));
async function importCode(specifier, cwd) {
    try {
        let normalized = specifier;
        if (specifier.startsWith('.')) {
            normalized = (0, node_url_1.pathToFileURL)(node_path_1.default.resolve(cwd, specifier));
        }
        else if (specifier.startsWith('file://')) {
            normalized = new URL(specifier);
        }
        return await import(normalized.toString());
    }
    catch (e) {
        throw new Error(`Failed to import formatter ${specifier}`, {
            cause: e,
        });
    }
}
exports.importCode = importCode;
//# sourceMappingURL=import_code.js.map