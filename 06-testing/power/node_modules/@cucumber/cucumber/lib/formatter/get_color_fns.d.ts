/// <reference types="node" />
/// <reference types="node" />
import { Writable } from 'node:stream';
import { TestStepResultStatus } from '@cucumber/messages';
export type IColorFn = (text: string) => string;
export interface IColorFns {
    forStatus: (status: TestStepResultStatus) => IColorFn;
    location: IColorFn;
    tag: IColorFn;
    diffAdded: IColorFn;
    diffRemoved: IColorFn;
    errorMessage: IColorFn;
    errorStack: IColorFn;
}
export default function getColorFns(stream: Writable, env: NodeJS.ProcessEnv, enabled?: boolean): IColorFns;
