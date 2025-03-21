"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logs_1 = __importDefault(require("./logs"));
class SpamDetector {
    constructor(options = {}) {
        this.pushId = (id) => this.users.push({
            _id: id,
            spam_point: 1
        });
        this.peek = (id) => this.users.find(v => v._id === id);
        this.detection = (client, m, options = {}) => {
            const is_hold = options.coldown?.hold(m.chat).state;
            const users = this.peek(m.sender);
            if (!m.fromMe && !users) {
                this.pushId(m.sender);
                (0, logs_1.default)(client, m, {
                    prefix: options.prefix,
                    command: options.command,
                    commands: options.commands,
                    show: options.show,
                    isSpam: false
                });
                return {
                    state: 'IS_SAVE'
                };
            }
            else {
                if (!m.fromMe && (new Date().getTime() - (options.users?.ban_temporary || 0) > this.HOLD_TIMER)) {
                    if (!options.users?.banned && !m.fromMe && users) {
                        users.spam_point += 1;
                        if (users.spam_point >= 2)
                            setTimeout(() => {
                                users.spam_point = 0;
                            }, this.RESET_TIMER * 1000);
                        (0, logs_1.default)(client, m, {
                            prefix: options.prefix,
                            command: options.command,
                            commands: options.commands,
                            show: options.show,
                            isSpam: (users.spam_point >= this.NOTIFY_THRESHOLD || users.spam_point >= this.BANNED_THRESHOLD) && !m.fromMe
                        });
                        const bannedTimes = options.banned_times || 0; // Berikan nilai default jika `banned_times` undefined
                        if (bannedTimes >= this.PERMANENT_THRESHOLD) {
                            options.users.banned = true;
                            options.users.ban_temporary = 0;
                            options.users.ban_times = 0;
                            return {
                                state: 'IS_BANNED',
                                msg: `You are permanently banned because you have been temporarily banned for ${this.PERMANENT_THRESHOLD} times.`
                            };
                        }
                        if (users.spam_point == this.NOTIFY_THRESHOLD)
                            return {
                                state: 'IS_NOTIFY',
                                msg: `Spam detected, cooldown for ${this.RESET_TIMER} seconds.`
                            };
                        if (users.spam_point >= this.BANNED_THRESHOLD) {
                            options.users.ban_temporary = new Date().getTime();
                            options.users.ban_times = (options.users.ban_times || 0) + 1; // Berikan nilai default jika `ban_times` undefined
                            return {
                                state: 'IS_TEMPORARY',
                                msg: `You were temporarily banned for ${((this.HOLD_TIMER / 1000) / 60)} minutes cause you over spam.`
                            };
                        }
                        return {
                            state: is_hold ? 'IS_HOLD' : 'IS_SAVE'
                        };
                    }
                }
                else {
                    if (users) {
                        users.spam_point += 1;
                        if (users.spam_point >= 2)
                            setTimeout(() => {
                                users.spam_point = 0;
                            }, this.RESET_TIMER * 1000);
                        (0, logs_1.default)(client, m, {
                            prefix: options.prefix,
                            command: options.command,
                            commands: options.commands,
                            show: options.show,
                            isSpam: (users.spam_point >= this.NOTIFY_THRESHOLD || users.spam_point >= this.BANNED_THRESHOLD) && !m.fromMe
                        });
                    }
                    return {
                        state: is_hold ? 'IS_HOLD' : 'IS_SAVE'
                    };
                }
            }
        };
        this.users = [];
        this.RESET_TIMER = options.RESET_TIMER || 3000;
        this.HOLD_TIMER = options.HOLD_TIMER || 1800000;
        this.PERMANENT_THRESHOLD = options.PERMANENT_THRESHOLD || 3;
        this.NOTIFY_THRESHOLD = options.NOTIFY_THRESHOLD || 4;
        this.BANNED_THRESHOLD = options.BANNED_THRESHOLD || 5;
    }
}
exports.default = SpamDetector;
