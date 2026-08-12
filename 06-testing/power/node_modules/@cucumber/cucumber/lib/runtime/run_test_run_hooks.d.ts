import { JsonObject } from 'type-fest';
import TestRunHookDefinition from '../models/test_run_hook_definition';
export type RunsTestRunHooks = (definitions: TestRunHookDefinition[], name: string) => Promise<void>;
export declare const makeRunTestRunHooks: (dryRun: boolean, defaultTimeout: number, worldParameters: JsonObject, errorMessage: (name: string, location: string) => string) => RunsTestRunHooks;
