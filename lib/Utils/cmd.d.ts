interface Plugin {
    async: boolean;
    error?: boolean;
}
declare class NeoxrCommands {
    plugins: Plugin[];
    create: (asyncFlag: boolean, object: Plugin, path?: string) => Promise<void>;
}
declare const _default: NeoxrCommands;
export default _default;
