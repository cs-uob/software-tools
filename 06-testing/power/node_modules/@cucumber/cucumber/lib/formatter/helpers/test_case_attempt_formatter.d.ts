import { IColorFns } from '../get_color_fns';
import StepDefinitionSnippetBuilder from '../step_definition_snippet_builder';
import { SupportCodeLibrary } from '../../support_code_library_builder/types';
import { ITestCaseAttempt } from './event_data_collector';
export interface IFormatTestCaseAttemptRequest {
    colorFns: IColorFns;
    testCaseAttempt: ITestCaseAttempt;
    snippetBuilder: StepDefinitionSnippetBuilder;
    supportCodeLibrary: SupportCodeLibrary;
    printAttachments?: boolean;
}
export declare function formatTestCaseAttempt({ colorFns, snippetBuilder, supportCodeLibrary, testCaseAttempt, printAttachments, }: IFormatTestCaseAttemptRequest): string;
