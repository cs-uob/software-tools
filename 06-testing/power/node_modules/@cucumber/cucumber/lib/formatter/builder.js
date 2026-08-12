"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const value_checker_1 = require("../value_checker");
const snippet_syntax_1 = require("./step_definition_snippet_builder/snippet_syntax");
const step_definition_snippet_builder_1 = __importDefault(require("./step_definition_snippet_builder"));
const javascript_snippet_syntax_1 = __importDefault(require("./step_definition_snippet_builder/javascript_snippet_syntax"));
const get_color_fns_1 = __importDefault(require("./get_color_fns"));
const formatters_1 = __importDefault(require("./helpers/formatters"));
const import_code_1 = require("./import_code");
const FormatterBuilder = {
    async build(FormatterConstructor, options) {
        if (typeof FormatterConstructor === 'string') {
            FormatterConstructor = await FormatterBuilder.getConstructorByType(FormatterConstructor, options.cwd);
        }
        const colorFns = (0, get_color_fns_1.default)(options.stream, options.env, options.parsedArgvOptions.colorsEnabled);
        const snippetBuilder = await FormatterBuilder.getStepDefinitionSnippetBuilder({
            cwd: options.cwd,
            snippetInterface: options.parsedArgvOptions.snippetInterface,
            snippetSyntax: options.parsedArgvOptions.snippetSyntax,
            supportCodeLibrary: options.supportCodeLibrary,
        });
        return new FormatterConstructor({
            colorFns,
            snippetBuilder,
            ...options,
        });
    },
    async getConstructorByType(type, cwd) {
        const formatters = formatters_1.default.getFormatters();
        return formatters[type]
            ? formatters[type]
            : await FormatterBuilder.loadCustomClass('formatter', type, cwd);
    },
    async getStepDefinitionSnippetBuilder({ cwd, snippetInterface, snippetSyntax, supportCodeLibrary, }) {
        if ((0, value_checker_1.doesNotHaveValue)(snippetInterface)) {
            snippetInterface = snippet_syntax_1.SnippetInterface.Synchronous;
        }
        let Syntax = javascript_snippet_syntax_1.default;
        if ((0, value_checker_1.doesHaveValue)(snippetSyntax)) {
            Syntax = await FormatterBuilder.loadCustomClass('syntax', snippetSyntax, cwd);
        }
        return new step_definition_snippet_builder_1.default({
            snippetSyntax: new Syntax(snippetInterface),
            parameterTypeRegistry: supportCodeLibrary.parameterTypeRegistry,
        });
    },
    async loadCustomClass(type, descriptor, cwd) {
        const CustomClass = FormatterBuilder.resolveConstructor(await (0, import_code_1.importCode)(descriptor, cwd));
        if ((0, value_checker_1.doesHaveValue)(CustomClass)) {
            return CustomClass;
        }
        else {
            throw new Error(`Custom ${type} (${descriptor}) does not export a function/class`);
        }
    },
    async loadFile(urlOrName) {
        return await import(urlOrName.toString());
    },
    resolveConstructor(ImportedCode) {
        if ((0, value_checker_1.doesNotHaveValue)(ImportedCode)) {
            return null;
        }
        if (typeof ImportedCode === 'function') {
            return ImportedCode;
        }
        else if (typeof ImportedCode === 'object' &&
            typeof ImportedCode.default === 'function') {
            return ImportedCode.default;
        }
        else if (typeof ImportedCode.default === 'object' &&
            typeof ImportedCode.default.default === 'function') {
            return ImportedCode.default.default;
        }
        return null;
    },
};
exports.default = FormatterBuilder;
//# sourceMappingURL=builder.js.map