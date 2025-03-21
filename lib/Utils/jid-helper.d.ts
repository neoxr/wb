declare const _default: (client: any) => {
    hostJid: boolean | undefined;
    clientJid: string | undefined;
    findJid: {
        bot: (jid: string) => any;
        group: (jid: string) => any;
        chat: (jid: string) => any;
        user: (jid: string) => any;
    } | undefined;
    bot: {
        jid: string;
        socket: any;
    }[];
    getbot: (jid: string) => any;
    setbot: (jid: string, socket: any) => number;
};
export default _default;
