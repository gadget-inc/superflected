export declare const parameterize: ((string: string, options?: {
    locale?: string;
    separator?: string | null;
    preserveCase?: boolean;
}) => string) & {
    cache: Map<string, string>;
    populate: (string: string, options?: {
        locale?: string;
        separator?: string | null;
        preserveCase?: boolean;
    } | undefined) => void;
};
