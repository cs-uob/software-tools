import * as messages from '@cucumber/messages';
import StepDefinition from '../models/step_definition';
import { RuntimeOptions } from '.';
export declare function getAmbiguousStepException(stepDefinitions: StepDefinition[]): string;
export declare function retriesForPickle(pickle: messages.Pickle, options: RuntimeOptions): number;
export declare function shouldCauseFailure(status: messages.TestStepResultStatus, options: RuntimeOptions): boolean;
