"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.worldProxy = exports.runInTestCaseScope = void 0;
const node_async_hooks_1 = require("node:async_hooks");
const make_proxy_1 = require("./make_proxy");
const testCaseScope = new node_async_hooks_1.AsyncLocalStorage();
async function runInTestCaseScope(store, callback) {
    return testCaseScope.run(store, callback);
}
exports.runInTestCaseScope = runInTestCaseScope;
function getWorld() {
    const store = testCaseScope.getStore();
    if (!store) {
        throw new Error('Attempted to access `world` from incorrect scope; only applicable to steps and case-level hooks');
    }
    return store.world;
}
/**
 * A proxy to the World instance for the currently-executing test case
 *
 * @beta
 * @remarks
 * Useful for getting a handle on the World when using arrow functions and thus
 * being unable to rely on the value of `this`. Only callable from the body of a
 * step or a `Before`, `After`, `BeforeStep` or `AfterStep` hook (will throw
 * otherwise).
 */
exports.worldProxy = (0, make_proxy_1.makeProxy)(getWorld);
//# sourceMappingURL=test_case_scope.js.map