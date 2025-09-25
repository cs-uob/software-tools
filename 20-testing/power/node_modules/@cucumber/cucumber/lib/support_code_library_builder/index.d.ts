import { IdGenerator } from '@cucumber/messages';
import * as messages from '@cucumber/messages';
import TestCaseHookDefinition from '../models/test_case_hook_definition';
import TestStepHookDefinition from '../models/test_step_hook_definition';
import TestRunHookDefinition from '../models/test_run_hook_definition';
import StepDefinition from '../models/step_definition';
import { GherkinStepKeyword } from '../models/gherkin_step_keyword';
import { IDefineSupportCodeMethods, IDefineTestCaseHookOptions, IDefineTestStepHookOptions, IDefineTestRunHookOptions, IParameterTypeDefinition, SupportCodeLibrary, TestCaseHookFunction, TestStepHookFunction, ISupportCodeCoordinates, IDefineStep, CanonicalSupportCodeIds } from './types';
interface IStepDefinitionConfig {
    code: Function;
    line: number;
    options: any;
    keyword: GherkinStepKeyword;
    pattern: string | RegExp;
    uri: string;
}
interface ITestCaseHookDefinitionConfig {
    code: any;
    line: number;
    options: any;
    uri: string;
}
interface ITestStepHookDefinitionConfig {
    code: Function;
    line: number;
    options: any;
    uri: string;
}
interface ITestRunHookDefinitionConfig {
    code: Function;
    line: number;
    options: any;
    uri: string;
}
export declare class SupportCodeLibraryBuilder {
    readonly methods: IDefineSupportCodeMethods;
    private originalCoordinates;
    private afterTestCaseHookDefinitionConfigs;
    private afterTestRunHookDefinitionConfigs;
    private afterTestStepHookDefinitionConfigs;
    private beforeTestCaseHookDefinitionConfigs;
    private beforeTestRunHookDefinitionConfigs;
    private beforeTestStepHookDefinitionConfigs;
    private cwd;
    private defaultTimeout;
    private definitionFunctionWrapper;
    private newId;
    private parameterTypeRegistry;
    private stepDefinitionConfigs;
    private World;
    private parallelCanAssign;
    private status;
    constructor();
    defineParameterType(options: IParameterTypeDefinition<any>): void;
    defineStep(keyword: GherkinStepKeyword, getCollection: () => IStepDefinitionConfig[]): IDefineStep;
    defineTestCaseHook(getCollection: () => ITestCaseHookDefinitionConfig[]): <WorldType>(options: string | IDefineTestCaseHookOptions | TestCaseHookFunction<WorldType>, code?: TestCaseHookFunction<WorldType>) => void;
    defineTestStepHook(getCollection: () => ITestStepHookDefinitionConfig[]): <WorldType>(options: string | IDefineTestStepHookOptions | TestStepHookFunction<WorldType>, code?: TestStepHookFunction<WorldType>) => void;
    defineTestRunHook(getCollection: () => ITestRunHookDefinitionConfig[]): (options: IDefineTestRunHookOptions | Function, code?: Function) => void;
    wrapCode({ code, wrapperOptions, }: {
        code: Function;
        wrapperOptions: any;
    }): Function;
    buildTestCaseHookDefinitions(configs: ITestCaseHookDefinitionConfig[], canonicalIds?: string[]): TestCaseHookDefinition[];
    buildTestStepHookDefinitions(configs: ITestStepHookDefinitionConfig[]): TestStepHookDefinition[];
    buildTestRunHookDefinitions(configs: ITestRunHookDefinitionConfig[]): TestRunHookDefinition[];
    buildStepDefinitions(canonicalIds?: string[]): {
        stepDefinitions: StepDefinition[];
        undefinedParameterTypes: messages.UndefinedParameterType[];
    };
    finalize(canonicalIds?: CanonicalSupportCodeIds): SupportCodeLibrary;
    reset(cwd: string, newId: IdGenerator.NewId, originalCoordinates?: ISupportCodeCoordinates): void;
}
declare const _default: SupportCodeLibraryBuilder;
export default _default;
