import { Envelope, IdGenerator, ParseError } from '@cucumber/messages';
import { IFilterablePickle } from '../filter';
import { ISourcesCoordinates } from './types';
export declare function getPicklesAndErrors({ newId, cwd, sourcePaths, coordinates, onEnvelope, }: {
    newId: IdGenerator.NewId;
    cwd: string;
    sourcePaths: string[];
    coordinates: ISourcesCoordinates;
    onEnvelope?: (envelope: Envelope) => void;
}): Promise<{
    filterablePickles: readonly IFilterablePickle[];
    parseErrors: ParseError[];
}>;
