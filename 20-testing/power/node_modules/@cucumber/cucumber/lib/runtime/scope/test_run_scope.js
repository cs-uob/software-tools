"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextProxy = exports.runInTestRunScope = void 0;
const node_async_hooks_1 = require("node:async_hooks");
const make_proxy_1 = require("./make_proxy");
const testRunScope = new node_async_hooks_1.AsyncLocalStorage();
async function runInTestRunScope(store, callback) {
    return testRunScope.run(store, callback);
}
exports.runInTestRunScope = runInTestRunScope;
function getContext() {
    const store = testRunScope.getStore();
    if (!store) {
        throw new Error('Attempted to access `context` from incorrect scope; only applicable to run-level hooks');
    }
    return store.context;
}
/**
 * A proxy to the context for the currently-executing test run.
 *
 * @beta
 * @remarks
 * Useful for getting a handle on the context when using arrow functions and thus
 * being unable to rely on the value of `this`. Only callable from the body of a
 * `BeforeAll` or `AfterAll` hook (will throw otherwise).
 */
exports.contextProxy = (0, make_proxy_1.makeProxy)(getContext);
//# sourceMappingURL=test_run_scope.js.map