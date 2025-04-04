"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const chokidar_1 = __importDefault(require("chokidar"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class Loader {
    constructor() {
        this.files = [];
        this.watcher = null;
    }
    async scan(dir) {
        return new Promise((resolve, reject) => {
            const watcher = chokidar_1.default.watch(dir, {
                ignored: (filePath) => /(^|[\/\\])\../.test(filePath),
                persistent: true,
                ignoreInitial: false,
                usePolling: false,
                depth: 5,
            });
            this.watcher = watcher;
            watcher
                .on('add', (filePath) => this.addFile(filePath))
                .on('ready', () => resolve(this.files))
                .on('error', (error) => reject(error));
        });
    }
    addFile(filePath) {
        if (!this.files.includes(filePath)) {
            this.files.push(filePath);
        }
    }
    removeFile(filePath) {
        this.files = this.files.filter((file) => file !== filePath);
    }
    load(filePath) {
        this.removeFile(filePath);
        this.files.push(filePath);
        console.log(chalk_1.redBright.bold('[ UPDATE ]'), (0, moment_timezone_1.default)().format('DD/MM/YYYY HH:mm:ss'), chalk_1.green.bold('~ ' + filePath));
    }
    watchChanges(updatePluginCallback) {
        if (!this.watcher) {
            throw new Error('Watcher not initialized. Run scan() first.');
        }
        const debounce = (fn, delay) => {
            let timer = null;
            return (...args) => {
                if (timer)
                    clearTimeout(timer);
                timer = setTimeout(() => fn(...args), delay);
            };
        };
        const debouncedUpdate = debounce(updatePluginCallback, 300);
        this.watcher
            .on('change', (filePath) => {
            this.load(filePath);
            debouncedUpdate();
        })
            .on('unlink', (filePath) => {
            this.removeFile(filePath);
            console.log(chalk_1.redBright.bold('[ DELETE ]'), (0, moment_timezone_1.default)().format('DD/MM/YYYY HH:mm:ss'), chalk_1.green.bold('~ ' + filePath));
            debouncedUpdate();
        });
    }
}
exports.default = Loader;
