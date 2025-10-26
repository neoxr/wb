"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const functions_js_1 = require("../../Utils/functions.js");
exports.default = async (bot) => {
    if (bot.isChildInstance) {
        return;
    }
    bot.debugLog('Main bot is updating its plugin list...');
    try {
        let allLoadedPluginsMap = bot.loader.getPlugins();
        if (!(allLoadedPluginsMap instanceof Map)) {
            (0, functions_js_1.printError)('Update plugin failed: Loader map is invalid. Attempting to self-heal...');
            bot.debugLog('Error in updatePlugin: getPlugins() did not return a Map. Forcing a reload.', true);
            const PATH_BASE = path_1.default.join(process.cwd(), bot.options.plugsdir);
            if (bot.options.plugsdir && fs_1.default.existsSync(PATH_BASE)) {
                await bot.loader.scan(PATH_BASE, bot.options?.debug);
                allLoadedPluginsMap = bot.loader.getPlugins();
                if (!(allLoadedPluginsMap instanceof Map)) {
                    (0, functions_js_1.printError)('Self-heal failed. Could not recover plugin map. Aborting update.');
                    bot.debugLog('Error: Reload attempt also failed to produce a valid plugin Map.', true);
                    return;
                }
                (0, functions_js_1.printError)('Self-heal successful. Plugins have been reloaded.');
                bot.debugLog('Plugin reload successful after detecting invalid state.');
            }
            else {
                (0, functions_js_1.printError)('Cannot self-heal: Plugins directory not found.');
                return;
            }
        }
        const allLoadedPlugins = Object.fromEntries(allLoadedPluginsMap.entries());
        const mainBotPlugins = {};
        const mainBotCommands = [];
        for (const [loaderKey, pluginWrapper] of Object.entries(allLoadedPlugins)) {
            if (!pluginWrapper || !pluginWrapper.run)
                continue;
            const plugin = pluginWrapper.run;
            const pluginFileName = path_1.default.basename(loaderKey.split('::')[0], '.js');
            if (bot.setting.hidden.includes(plugin.category || ''))
                continue;
            if (bot.setting.pluginDisable.includes(pluginFileName))
                continue;
            mainBotPlugins[loaderKey] = pluginWrapper;
            if (plugin.usage)
                mainBotCommands.push(plugin.usage);
            if (plugin.hidden)
                mainBotCommands.push(plugin.hidden);
        }
        bot.plugins = mainBotPlugins;
        bot.commands = (0, functions_js_1.arrayJoin)(mainBotCommands);
        bot.debugLog(`Main bot updated with ${Object.keys(bot.plugins).length} plugins.`);
        for (const childBot of bot.activeChildBots.values()) {
            const childSettings = childBot.setting;
            const childPlugins = {};
            const childCommands = [];
            for (const [loaderKey, pluginWrapper] of Object.entries(allLoadedPlugins)) {
                if (!pluginWrapper || !pluginWrapper.run)
                    continue;
                const plugin = pluginWrapper.run;
                const pluginFileName = path_1.default.basename(loaderKey.split('::')[0], '.js');
                if (childSettings.hidden.includes(plugin.category || ''))
                    continue;
                if (childSettings.pluginDisable.includes(pluginFileName))
                    continue;
                childPlugins[loaderKey] = pluginWrapper;
                if (plugin.usage)
                    childCommands.push(plugin.usage);
                if (plugin.hidden)
                    childCommands.push(plugin.hidden);
            }
            childBot.plugins = childPlugins;
            childBot.commands = (0, functions_js_1.arrayJoin)(childCommands);
            bot.debugLog(`Distributed ${Object.keys(childPlugins).length} plugins to child bot ${childBot.getBotIdentifier()}`);
        }
    }
    catch (e) {
        bot.plugins = {};
        bot.commands = [];
        bot.debugLog(`Error in updatePlugin: ${e.message}`, true);
        (0, functions_js_1.printError)('Update plugin failed: ' in e ? e.message : String(e));
    }
};
