export default class Spam {
    delay: number;
    cooldown: {
        _id: string;
        timer: number;
    }[];
    constructor(delay: number);
    isHold: (id: string) => {
        _id: string;
        timer: number;
    } | undefined;
    pushId: (id: string) => number;
    hold: (id: string, fromMe: boolean) => {
        state: boolean;
    } | undefined;
    check: (id: string) => {
        state: boolean;
    } | undefined;
}
