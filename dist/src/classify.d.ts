export declare const classify: ((tableName: string) => string) & {
    cache: Map<string, string>;
    populate: (tableName: string) => void;
};
