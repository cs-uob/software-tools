/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'node:events';
import { Writable as WritableStream } from 'node:stream';
import { SupportCodeLibrary } from '../support_code_library_builder/types';
import { SnippetInterface } from './step_definition_snippet_builder/snippet_syntax';
import EventDataCollector from './helpers/event_data_collector';
import StepDefinitionSnippetBuilder from './step_definition_snippet_builder';
import Formatter, { FormatOptions, IFormatterCleanupFn, IFormatterLogFn } from '.';
interface IGetStepDefinitionSnippetBuilderOptions {
    cwd: string;
    snippetInterface?: SnippetInterface;
    snippetSyntax?: string;
    supportCodeLibrary: SupportCodeLibrary;
}
export interface IBuildOptions {
    env: NodeJS.ProcessEnv;
    cwd: string;
    eventBroadcaster: EventEmitter;
    eventDataCollector: EventDataCollector;
    log: IFormatterLogFn;
    parsedArgvOptions: FormatOptions;
    stream: WritableStream;
    cleanup: IFormatterCleanupFn;
    supportCodeLibrary: SupportCodeLibrary;
}
declare const FormatterBuilder: {
    build(FormatterConstructor: string | typeof Formatter, options: IBuildOptions): Promise<Formatter>;
    getConstructorByType(type: string, cwd: string): Promise<typeof Formatter>;
    getStepDefinitionSnippetBuilder({ cwd, snippetInterface, snippetSyntax, supportCodeLibrary, }: IGetStepDefinitionSnippetBuilderOptions): Promise<StepDefinitionSnippetBuilder>;
    loadCustomClass(type: 'formatter' | 'syntax', descriptor: string, cwd: string): Promise<any>;
    loadFile(urlOrName: URL | string): Promise<any>;
    resolveConstructor(ImportedCode: any): any;
};
export default FormatterBuilder;
