export declare const constantify: ((word: string) => string) & {
    cache: Map<string, string>;
    populate: (word: string) => string;
};
