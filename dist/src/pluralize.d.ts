export declare const pluralize: ((word: string, locale?: any) => string) & {
    cache: Map<string, string>;
    populate: (word: string, locale?: any) => void;
};
