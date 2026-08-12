"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClassOrPlugin = void 0;
const value_checker_1 = require("../value_checker");
function findClassOrPlugin(imported) {
    return findRecursive(imported, 3);
}
exports.findClassOrPlugin = findClassOrPlugin;
function findRecursive(thing, depth) {
    if ((0, value_checker_1.doesNotHaveValue)(thing)) {
        return null;
    }
    if (typeof thing === 'function') {
        return thing;
    }
    if (typeof thing === 'object' && thing.type === 'formatter') {
        return thing;
    }
    depth--;
    if (depth > 0) {
        return findRecursive(thing.default, depth);
    }
    return null;
}
//# sourceMappingURL=find_class_or_plugin.js.map