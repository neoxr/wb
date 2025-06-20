declare class Caching {
    cache: Map<string, {
        value: any;
        timestamp: number;
    }>;
    cacheTtl: number;
    nullCacheTtl: number;
    constructor(cacheTtl?: number, nullCacheTtl?: number);
    setCache(key: string, value: any, ttl: number): void;
    getCache(key: string): any;
    cacheFunction(key: string, func: () => Promise<any>): Promise<any>;
}
declare const _default: Caching;
export default _default;
