export declare class Transliterator {
    approximations: Record<string, string>;
    constructor();
    approximate(char: string, replacement: string): void;
    transliterate(string: string, replacement: string): string;
}
export declare function transliterations(locale?: string): Transliterator;
export declare function setTransliterations(locale: string, fn: (transliterator: Transliterator) => void): void;
export declare function transliterate(string: string, options?: {
    locale?: string;
    replacement?: string;
}): string;
