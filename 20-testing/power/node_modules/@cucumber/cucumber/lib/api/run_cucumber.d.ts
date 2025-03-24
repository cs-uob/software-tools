import { Envelope } from '@cucumber/messages';
import { IRunEnvironment } from '../environment';
import { IRunOptions, IRunResult } from './types';
/**
 * Execute a Cucumber test run and return the overall result
 *
 * @public
 * @param options - Options for the run, obtainable via {@link loadConfiguration}
 * @param environment - Project environment
 * @param onMessage - Callback fired each time Cucumber emits a message
 */
export declare function runCucumber(options: IRunOptions, environment?: IRunEnvironment, onMessage?: (message: Envelope) => void): Promise<IRunResult>;
