export declare const underscore: ((camelCasedWord: string) => string) & {
    cache: Map<string, string>;
    populate: (camelCasedWord: string) => void;
};
