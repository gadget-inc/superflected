/**
 * aho-corasick fast string subsearching algorithm implementation
 * taken from https://github.com/sonofmagic/modern-ahocorasick/blob/26c881a43f5da1029b31bba86be5fa1d78df58c9/src/index.ts and modified for our uses to check for word boundaries or subsequent matches for searches
 */
export declare class AhoCorasick {
    gotoFn: Record<number, Record<string, number>>;
    output: Record<number, string>;
    failure: Record<number, number>;
    constructor(keywords: string[]);
    search(str: string, testWordBoundary?: typeof isWordBoundary, prefix?: boolean): [number, string][];
}
declare function isWordBoundary(char: string): boolean;
export {};
