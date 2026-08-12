import { ILogger } from '../environment';
import { IConfiguration } from './types';
export declare function parseConfiguration(logger: ILogger, source: string, definition: Partial<IConfiguration> | string[] | string | undefined): Partial<IConfiguration>;
