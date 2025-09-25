import { Duration } from '@cucumber/messages';
/**
 * A utility for timing test run operations and returning duration and
 * timestamp objects in messages-compatible formats
 */
export interface IStopwatch {
    start: () => IStopwatch;
    stop: () => IStopwatch;
    duration: () => Duration;
}
export declare const create: (base?: Duration) => IStopwatch;
export declare const timestamp: () => import("@cucumber/messages").Timestamp;
