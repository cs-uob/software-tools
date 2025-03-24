import { IdGenerator } from '@cucumber/messages';
import { SupportCodeLibrary } from '../support_code_library_builder/types';
import { ILogger } from '../environment';
export declare function getSupportCodeLibrary({ logger, cwd, newId, requireModules, requirePaths, importPaths, loaders, }: {
    logger: ILogger;
    cwd: string;
    newId: IdGenerator.NewId;
    requireModules: string[];
    requirePaths: string[];
    importPaths: string[];
    loaders: string[];
}): Promise<SupportCodeLibrary>;
