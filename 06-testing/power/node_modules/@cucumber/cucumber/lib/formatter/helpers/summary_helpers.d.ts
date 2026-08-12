import * as messages from '@cucumber/messages';
import { IColorFns } from '../get_color_fns';
import { ITestCaseAttempt } from './event_data_collector';
export interface IFormatSummaryRequest {
    colorFns: IColorFns;
    testCaseAttempts: ITestCaseAttempt[];
    testRunDuration: messages.Duration;
}
export declare function formatSummary({ colorFns, testCaseAttempts, testRunDuration, }: IFormatSummaryRequest): string;
