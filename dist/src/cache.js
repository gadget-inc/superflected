"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheable = void 0;
/** Wrap a given function in a cache that is off by default */
const cacheable = (fn, getCacheKey = ((str) => str)) => {
    const cache = new Map();
    const cachedFn = Object.assign(function (...args) {
        return cache.get(getCacheKey(...args)) ?? fn.call(this, ...args);
    }, {
        cache,
        populate: (...args) => {
            const result = fn(...args);
            cache.set(getCacheKey(...args), result);
            return result;
        },
    });
    return cachedFn;
};
exports.cacheable = cacheable;
