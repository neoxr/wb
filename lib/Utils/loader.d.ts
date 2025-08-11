export default class Loader {
    files: string[];
    private watcher;
    constructor();
    scan(dir: string): Promise<string[]>;
    private addFile;
    private removeFile;
    load(filePath: string): void;
    watchChanges(updatePluginCallback: () => void): void;
}
