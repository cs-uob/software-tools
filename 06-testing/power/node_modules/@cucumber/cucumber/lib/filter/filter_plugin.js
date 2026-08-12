"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPlugin = void 0;
const pickle_filter_1 = __importDefault(require("../pickle_filter"));
const helpers_1 = require("../cli/helpers");
exports.filterPlugin = {
    type: 'plugin',
    coordinator: async ({ on, options, logger, environment }) => {
        let unexpandedSourcePaths = [];
        on('paths:resolve', (paths) => {
            unexpandedSourcePaths = paths.unexpandedSourcePaths;
        });
        on('pickles:filter', async (allPickles) => {
            const pickleFilter = new pickle_filter_1.default({
                cwd: environment.cwd,
                featurePaths: unexpandedSourcePaths,
                names: options.names,
                tagExpression: options.tagExpression,
            });
            return allPickles.filter((pickle) => pickleFilter.matches(pickle));
        });
        on('pickles:order', async (unorderedPickles) => {
            const orderedPickles = [...unorderedPickles];
            (0, helpers_1.orderPickles)(orderedPickles, options.order, logger);
            return orderedPickles;
        });
    },
};
//# sourceMappingURL=filter_plugin.js.map