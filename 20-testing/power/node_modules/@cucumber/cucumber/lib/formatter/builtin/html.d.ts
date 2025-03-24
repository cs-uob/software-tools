interface Options {
    externalAttachments?: true;
}
declare const _default: {
    type: "formatter";
    formatter({ on, options, write, directory }: import("../../plugin").FormatterPluginContext<Options>): () => Promise<void>;
    optionsKey: string;
};
export default _default;
