export default class Message {
    tags: {
        album: string;
        APIC: Buffer<ArrayBuffer>;
    };
    mention: (text: string) => string[];
    createMessageFunction: (sock: any, bypassDisappearing: boolean | undefined, groupCache: any) => void;
}
