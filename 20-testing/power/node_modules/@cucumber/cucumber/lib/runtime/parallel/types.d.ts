import { Envelope } from '@cucumber/messages';
import { RuntimeOptions } from '../index';
import { ISupportCodeCoordinates } from '../../api';
import { AssembledTestCase } from '../../assemble';
import { CanonicalSupportCodeIds } from '../../support_code_library_builder/types';
export type CoordinatorToWorkerCommand = InitializeCommand | RunCommand | FinalizeCommand;
export interface InitializeCommand {
    type: 'INITIALIZE';
    supportCodeCoordinates: ISupportCodeCoordinates;
    supportCodeIds: CanonicalSupportCodeIds;
    options: RuntimeOptions;
}
export interface RunCommand {
    type: 'RUN';
    assembledTestCase: AssembledTestCase;
    failing: boolean;
}
export interface FinalizeCommand {
    type: 'FINALIZE';
}
export type WorkerToCoordinatorEvent = ReadyEvent | EnvelopeEvent | FinishedEvent;
export interface ReadyEvent {
    type: 'READY';
}
export interface EnvelopeEvent {
    type: 'ENVELOPE';
    envelope: Envelope;
}
export interface FinishedEvent {
    type: 'FINISHED';
    success: boolean;
}
