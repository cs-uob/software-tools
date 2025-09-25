"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportCodeLibrary = void 0;
const node_module_1 = require("node:module");
const node_url_1 = require("node:url");
const support_code_library_builder_1 = __importDefault(require("../support_code_library_builder"));
const try_require_1 = __importDefault(require("../try_require"));
async function getSupportCodeLibrary({ logger, cwd, newId, requireModules, requirePaths, importPaths, loaders, }) {
    support_code_library_builder_1.default.reset(cwd, newId, {
        requireModules,
        requirePaths,
        importPaths,
        loaders,
    });
    requireModules.map((path) => {
        logger.debug(`Attempting to require code from "${path}"`);
        (0, try_require_1.default)(path);
    });
    requirePaths.map((path) => {
        logger.debug(`Attempting to require code from "${path}"`);
        (0, try_require_1.default)(path);
    });
    for (const specifier of loaders) {
        logger.debug(`Attempting to register loader "${specifier}"`);
        (0, node_module_1.register)(specifier, (0, node_url_1.pathToFileURL)('./'));
    }
    for (const path of importPaths) {
        logger.debug(`Attempting to import code from "${path}"`);
        await import((0, node_url_1.pathToFileURL)(path).toString());
    }
    return support_code_library_builder_1.default.finalize();
}
exports.getSupportCodeLibrary = getSupportCodeLibrary;
//# sourceMappingURL=support.js.map