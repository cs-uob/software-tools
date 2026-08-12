"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConfiguration = void 0;
const string_argv_1 = __importDefault(require("string-argv"));
const argv_parser_1 = __importDefault(require("./argv_parser"));
const check_schema_1 = require("./check_schema");
function parseConfiguration(logger, source, definition) {
    if (!definition) {
        return {};
    }
    if (Array.isArray(definition)) {
        logger.debug(`${source} configuration value is an array; parsing as argv`);
        const { configuration } = argv_parser_1.default.parse([
            'node',
            'cucumber-js',
            ...definition,
        ]);
        return configuration;
    }
    if (typeof definition === 'string') {
        logger.debug(`${source} configuration value is a string; parsing as argv`);
        const { configuration } = argv_parser_1.default.parse([
            'node',
            'cucumber-js',
            ...(0, string_argv_1.default)(definition),
        ]);
        return configuration;
    }
    try {
        return (0, check_schema_1.checkSchema)(definition);
    }
    catch (error) {
        throw new Error(`${source} configuration value failed schema validation: ${error.errors.join(' ')}`);
    }
}
exports.parseConfiguration = parseConfiguration;
//# sourceMappingURL=parse_configuration.js.map