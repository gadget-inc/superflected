export declare const humanize: ((lowerCaseAndUnderscoredWord: string, options?: {
    capitalize?: boolean;
}) => string) & {
    cache: Map<string, string>;
    populate: (lowerCaseAndUnderscoredWord: string, options?: {
        capitalize?: boolean;
    } | undefined) => string;
};
