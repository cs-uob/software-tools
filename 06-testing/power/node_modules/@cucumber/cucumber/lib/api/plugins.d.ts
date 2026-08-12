import { PluginManager } from '../plugin';
import { UsableEnvironment } from '../environment';
import { IRunConfiguration, ISourcesCoordinates } from './types';
export declare function initializeForLoadSources(coordinates: ISourcesCoordinates, environment: UsableEnvironment): Promise<PluginManager>;
export declare function initializeForLoadSupport(environment: UsableEnvironment): Promise<PluginManager>;
export declare function initializeForRunCucumber(configuration: IRunConfiguration, environment: UsableEnvironment): Promise<PluginManager>;
