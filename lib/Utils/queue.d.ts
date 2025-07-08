export default class Queue {
    items: any[];
    delay: number;
    constructor(delay: number);
    enqueue: (item: any) => number;
    dequeue: () => void;
    peek: (access?: boolean) => Promise<any>;
    count: () => number;
}
