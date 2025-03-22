"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Spam {
    constructor(delay) {
        this.isHold = (id) => this.cooldown.find(v => v._id === id);
        this.pushId = (id) => this.cooldown.push({
            _id: id,
            timer: Date.now()
        });
        this.hold = (id, fromMe) => {
            const isHold = this.isHold(id);
            if (!isHold) {
                this.pushId(id);
                return { state: false };
            }
            if (isHold && (Date.now() - isHold.timer < (this.delay * 1000)))
                return { state: true };
            if (isHold && Math.max(0, (this.delay * 1000) - (Date.now() - isHold.timer)) < 1) {
                isHold.timer = Date.now();
                return { state: false };
            }
        };
        this.check = (id) => {
            const isHold = this.isHold(id);
            if (!isHold)
                return { state: false };
            if (isHold && (Date.now() - isHold.timer < (this.delay * 1000)))
                return { state: true };
            if (isHold && Math.max(0, (this.delay * 1000) - (Date.now() - isHold.timer)) < 1) {
                return { state: false };
            }
        };
        this.delay = delay;
        this.cooldown = [];
    }
}
exports.default = Spam;
