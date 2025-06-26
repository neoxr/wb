declare class Loader {
    plugins: {
        [key: string]: any;
    };
    scrapers: {
        [key: string]: any;
    };
    constructor();
    require: (file: string) => any;
    router: (dir: string) => Promise<void>;
    scraper: (dir: string) => Promise<void>;
}
declare const _default: Loader;
export default _default;
