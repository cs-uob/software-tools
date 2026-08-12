"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePaths = void 0;
const node_path_1 = __importDefault(require("node:path"));
const glob_1 = require("glob");
const fs_1 = __importDefault(require("mz/fs"));
async function resolvePaths(logger, cwd, sources, support = {
    requireModules: [],
    requirePaths: [],
    importPaths: [],
    loaders: [],
}) {
    const unexpandedSourcePaths = await getUnexpandedSourcePaths(cwd, sources.paths);
    const sourcePaths = await expandSourcePaths(cwd, unexpandedSourcePaths);
    logger.debug('Found source files based on configuration:', sourcePaths);
    const { requirePaths, importPaths } = await deriveSupportPaths(cwd, sourcePaths, support.requirePaths, support.importPaths);
    logger.debug('Found support files to load via `require` based on configuration:', requirePaths);
    logger.debug('Found support files to load via `import` based on configuration:', importPaths);
    return {
        unexpandedSourcePaths: unexpandedSourcePaths,
        sourcePaths: sourcePaths,
        requirePaths,
        importPaths,
    };
}
exports.resolvePaths = resolvePaths;
async function expandPaths(cwd, unexpandedPaths, defaultExtension) {
    const expandedPaths = await Promise.all(unexpandedPaths.map(async (unexpandedPath) => {
        const matches = await (0, glob_1.glob)(unexpandedPath, {
            absolute: true,
            windowsPathsNoEscape: true,
            cwd,
        });
        const expanded = await Promise.all(matches.map(async (match) => {
            if (node_path_1.default.extname(match) === '') {
                return (0, glob_1.glob)(`${match}/**/*${defaultExtension}`, {
                    windowsPathsNoEscape: true,
                });
            }
            return [match];
        }));
        return expanded.flat().sort();
    }));
    const normalized = expandedPaths.flat().map((x) => node_path_1.default.normalize(x));
    return [...new Set(normalized)];
}
async function getUnexpandedSourcePaths(cwd, args) {
    if (args.length > 0) {
        const nestedFeaturePaths = await Promise.all(args.map(async (arg) => {
            const filename = node_path_1.default.basename(arg);
            if (filename[0] === '@') {
                const filePath = node_path_1.default.join(cwd, arg);
                const content = await fs_1.default.readFile(filePath, 'utf8');
                return content.split('\n').map((x) => x.trim());
            }
            return [arg];
        }));
        const featurePaths = nestedFeaturePaths.flat();
        if (featurePaths.length > 0) {
            return featurePaths.filter((x) => x !== '');
        }
    }
    return ['features/**/*.{feature,feature.md}'];
}
function getFeatureDirectoryPaths(cwd, featurePaths) {
    const featureDirs = featurePaths.map((featurePath) => {
        let featureDir = node_path_1.default.dirname(featurePath);
        let childDir;
        let parentDir = featureDir;
        while (childDir !== parentDir) {
            childDir = parentDir;
            parentDir = node_path_1.default.dirname(childDir);
            if (node_path_1.default.basename(parentDir) === 'features') {
                featureDir = parentDir;
                break;
            }
        }
        return node_path_1.default.relative(cwd, featureDir);
    });
    return [...new Set(featureDirs)];
}
async function expandSourcePaths(cwd, featurePaths) {
    featurePaths = featurePaths.map((p) => p.replace(/(:\d+)*$/g, '')); // Strip line numbers
    return await expandPaths(cwd, featurePaths, '.feature');
}
async function deriveSupportPaths(cwd, featurePaths, unexpandedRequirePaths, unexpandedImportPaths) {
    if (unexpandedRequirePaths.length === 0 &&
        unexpandedImportPaths.length === 0) {
        const defaultPaths = getFeatureDirectoryPaths(cwd, featurePaths);
        const importPaths = await expandPaths(cwd, defaultPaths, '.@(js|cjs|mjs)');
        return { requirePaths: [], importPaths };
    }
    const requirePaths = unexpandedRequirePaths.length > 0
        ? await expandPaths(cwd, unexpandedRequirePaths, '.js')
        : [];
    const importPaths = unexpandedImportPaths.length > 0
        ? await expandPaths(cwd, unexpandedImportPaths, '.@(js|cjs|mjs)')
        : [];
    return { requirePaths, importPaths };
}
//# sourceMappingURL=paths.js.map