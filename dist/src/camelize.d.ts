export declare const camelize: ((term: string, uppercaseFirstLetter?: any) => string) & {
    cache: Map<string, string>;
    populate: (term: string, uppercaseFirstLetter?: any) => string;
};
