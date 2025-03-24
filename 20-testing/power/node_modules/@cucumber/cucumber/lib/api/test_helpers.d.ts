import { IRunEnvironment } from '../environment';
export declare function setupEnvironment(): Promise<Partial<IRunEnvironment>>;
export declare function teardownEnvironment(environment: IRunEnvironment): Promise<void>;
