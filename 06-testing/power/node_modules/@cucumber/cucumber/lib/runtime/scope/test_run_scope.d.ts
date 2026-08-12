import { IContext } from '../../support_code_library_builder/context';
interface TestRunScopeStore<ParametersType = any> {
    context: IContext<ParametersType>;
}
export declare function runInTestRunScope<ResponseType>(store: TestRunScopeStore, callback: () => ResponseType): Promise<ResponseType>;
/**
 * A proxy to the context for the currently-executing test run.
 *
 * @beta
 * @remarks
 * Useful for getting a handle on the context when using arrow functions and thus
 * being unable to rely on the value of `this`. Only callable from the body of a
 * `BeforeAll` or `AfterAll` hook (will throw otherwise).
 */
export declare const contextProxy: IContext<any>;
export {};
