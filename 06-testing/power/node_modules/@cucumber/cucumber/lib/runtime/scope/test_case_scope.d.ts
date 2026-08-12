import { IWorld } from '../../support_code_library_builder/world';
interface TestCaseScopeStore<ParametersType = any> {
    world: IWorld<ParametersType>;
}
export declare function runInTestCaseScope<ResponseType>(store: TestCaseScopeStore, callback: () => ResponseType): Promise<ResponseType>;
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
export declare const worldProxy: IWorld<any>;
export {};
