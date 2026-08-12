import { WorkerToCoordinatorEvent, CoordinatorToWorkerCommand, InitializeCommand, RunCommand } from './types';
type IExitFunction = (exitCode: number, error?: Error, message?: string) => void;
type IMessageSender = (command: WorkerToCoordinatorEvent) => void;
export declare class ChildProcessWorker {
    private readonly cwd;
    private readonly exit;
    private readonly id;
    private readonly eventBroadcaster;
    private readonly newId;
    private readonly sendMessage;
    private options;
    private supportCodeLibrary;
    private worker;
    constructor({ cwd, exit, id, sendMessage, }: {
        cwd: string;
        exit: IExitFunction;
        id: string;
        sendMessage: IMessageSender;
    });
    initialize({ supportCodeCoordinates, supportCodeIds, options, }: InitializeCommand): Promise<void>;
    finalize(): Promise<void>;
    receiveMessage(command: CoordinatorToWorkerCommand): Promise<void>;
    runTestCase(command: RunCommand): Promise<void>;
}
export {};
