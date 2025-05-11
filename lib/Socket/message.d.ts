export default class Message {
    tags: any;
    customId: string;
    constructor();
    mention: (text: string) => string[];
    createMessageFunction: (sock: any, bypassDisappearing: boolean | undefined, groupCache: any) => void;
}
