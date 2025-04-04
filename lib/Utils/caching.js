"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Caching {
    constructor(cacheTtl = 3 * 60 * 1000, nullCacheTtl = 1 * 60 * 1000) {
        this.cache = new Map();
        this.cacheTtl = cacheTtl;
        this.nullCacheTtl = nullCacheTtl;
    }
    setCache(key, value, ttl) {
        const now = Date.now();
        this.cache.set(key, { value, timestamp: now + ttl });
    }
    getCache(key) {
        const now = Date.now();
        if (this.cache.has(key)) {
            const cached = this.cache.get(key);
            if (now < cached.timestamp) {
                return cached.value;
            }
            else {
                this.cache.delete(key);
            }
        }
        return null;
    }
    async cacheFunction(key, func) {
        try {
            const result = await func();
            if (result === null) {
                const cached = this.getCache(key);
                if (cached !== null && cached.value !== null) {
                    this.setCache(key, cached.value, this.cacheTtl);
                }
            }
            else {
                this.setCache(key, result, this.cacheTtl);
            }
            return result;
        }
        catch (error) {
            console.error('Error executing function:', error);
            return null;
        }
    }
}
exports.default = new Caching;
