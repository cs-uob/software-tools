import { IRunEnvironment } from '../environment';
import { ILoadSupportOptions, ISupportCodeLibrary } from './types';
/**
 * Load support code for use in test runs
 *
 * @public
 * @param options - Options required to find the support code
 * @param environment - Project environment
 */
export declare function loadSupport(options: ILoadSupportOptions, environment?: IRunEnvironment): Promise<ISupportCodeLibrary>;
