/** Wrap a given function in a cache that is off by default */
export declare const cacheable: <T extends (...args: any[]) => any>(fn: T, getCacheKey?: (...args: Parameters<T>) => string) => T & {
    cache: Map<string, ReturnType<T>>;
    populate: (...args: Parameters<T>) => void;
};
