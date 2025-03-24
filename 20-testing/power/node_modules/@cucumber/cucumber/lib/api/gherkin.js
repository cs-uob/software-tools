"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPicklesAndErrors = void 0;
const gherkin_streams_1 = require("@cucumber/gherkin-streams");
const gherkin_utils_1 = require("@cucumber/gherkin-utils");
async function getPicklesAndErrors({ newId, cwd, sourcePaths, coordinates, onEnvelope, }) {
    const gherkinQuery = new gherkin_utils_1.Query();
    const parseErrors = [];
    await gherkinFromPaths(sourcePaths, {
        newId,
        relativeTo: cwd,
        defaultDialect: coordinates.defaultDialect,
    }, (envelope) => {
        gherkinQuery.update(envelope);
        if (envelope.parseError) {
            parseErrors.push(envelope.parseError);
        }
        onEnvelope?.(envelope);
    });
    const filterablePickles = gherkinQuery.getPickles().map((pickle) => {
        const gherkinDocument = gherkinQuery
            .getGherkinDocuments()
            .find((doc) => doc.uri === pickle.uri);
        const location = gherkinQuery.getLocation(pickle.astNodeIds[pickle.astNodeIds.length - 1]);
        return {
            gherkinDocument,
            location,
            pickle,
        };
    });
    return {
        filterablePickles,
        parseErrors,
    };
}
exports.getPicklesAndErrors = getPicklesAndErrors;
async function gherkinFromPaths(paths, options, onEnvelope) {
    return new Promise((resolve, reject) => {
        const gherkinMessageStream = gherkin_streams_1.GherkinStreams.fromPaths(paths, options);
        gherkinMessageStream.on('data', onEnvelope);
        gherkinMessageStream.on('end', resolve);
        gherkinMessageStream.on('error', reject);
    });
}
//# sourceMappingURL=gherkin.js.map