import { AhoCorasick } from "./ahoCorasick";
/** Stores all the special cases for how words can be inflected */
export declare class Inflector {
    plurals: [RegExp | string, string][];
    singulars: [RegExp | string, string][];
    uncountables: string[];
    humans: [RegExp | string, string][];
    lowerToAcronyms: Record<string, string>;
    casedAcronymMatcher: AhoCorasick | null;
    lowerAcronymMatcher: AhoCorasick | null;
    acronym(word: string): void;
    plural(rule: RegExp | string, replacement: string): void;
    singular(rule: RegExp | string, replacement: string): void;
    irregular(singular: string, plural: string): void;
    uncountable(...words: string[]): void;
    human(rule: RegExp | string, replacement: string): void;
    clear(scope?: "all" | "plurals" | "singulars" | "uncountables" | "humans" | "acronyms"): void;
}
export declare function inflections(locale?: string): Inflector;
export declare function setInflections(locale: string, fn: (inflector: Inflector) => void): void;
