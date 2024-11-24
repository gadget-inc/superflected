/** Wrap a given function in a cache that is off by default */
export const cacheable = <T extends (...args: any[]) => any>(
  fn: T,
  getCacheKey: (...args: Parameters<T>) => string = ((str: string) => str) as unknown as (...args: Parameters<T>) => string
): T & {
  /** A cache that stores results of the function. Not used by default. */
  cache: Map<string, ReturnType<T>>;
  /** Populate the cache with the result of calling the function. */
  populate: (...args: Parameters<T>) => ReturnType<T>;
} => {
  const cache = new Map<string, ReturnType<T>>();

  const cachedFn = Object.assign(
    function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
      return cache.get(getCacheKey(...args)) ?? fn.call(this, ...args);
    },
    {
      cache,
      populate: (...args: Parameters<T>): ReturnType<T> => {
        const result = fn(...args);
        cache.set(getCacheKey(...args), result);
        return result;
      },
    }
  );

  return cachedFn as T & { cache: Map<string, ReturnType<T>>; populate: (...args: Parameters<T>) => ReturnType<T> };
};
