"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor(delay) {
        this.items = [];
        this.enqueue = (item) => this.items.push(item);
        this.dequeue = () => {
            if (this.count() > 0)
                this.items.shift();
        };
        this.peek = async (access = false) => {
            if (!access) {
                await new Promise(resolve => setTimeout(resolve, this.delay * 1000));
                if (this.count() > 0)
                    return this.items[0];
                return false;
            }
            else {
                await new Promise(resolve => setTimeout(resolve, 1500));
                if (this.count() > 0)
                    return this.items[0];
                return false;
            }
        };
        this.count = () => this.items.length;
        this.delay = delay;
    }
}
exports.default = Queue;
