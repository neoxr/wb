declare class Instance {
    private bot;
    constructor();
    private init;
    getBot: (jid: string) => any | undefined;
    getBotByHash: (hash: string) => any | undefined;
    getData: (jid: string) => any | undefined;
    getDataByHash: (hash: string) => any | undefined;
    setBot: (jid: string, socket: any) => void;
    delBot: (jid: string) => boolean;
}
declare const _default: Instance;
export default _default;
