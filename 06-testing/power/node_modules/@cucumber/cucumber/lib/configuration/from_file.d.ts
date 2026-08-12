import { ILogger } from '../environment';
import { IConfiguration } from './types';
export declare function fromFile(logger: ILogger, cwd: string, file: string, profiles?: string[]): Promise<Partial<IConfiguration>>;
