export declare const singularize: ((word: string, locale?: any) => string) & {
    cache: Map<string, string>;
    populate: (word: string, locale?: any) => string;
};
