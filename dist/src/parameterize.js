"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parameterize = void 0;
const cache_1 = require("./cache");
const Transliterator_1 = require("./Transliterator");
exports.parameterize = (0, cache_1.cacheable)((string, options = {}) => {
    if (options.separator === undefined) {
        options.separator = "-";
    }
    if (options.separator === null) {
        options.separator = "";
    }
    // replace accented chars with their ascii equivalents
    let result = (0, Transliterator_1.transliterate)(string, { locale: options.locale });
    result = result.replace(/[^a-z0-9\-_]+/gi, options.separator);
    if (options.separator.length) {
        const separatorRegex = new RegExp(options.separator);
        // no more than one of the separator in a row
        result = result.replace(new RegExp(separatorRegex.source + "{2,}"), options.separator);
        // remove leading/trailing separator
        result = result.replace(new RegExp("^" + separatorRegex.source + "|" + separatorRegex.source + "$", "i"), "");
    }
    if (options.preserveCase) {
        return result;
    }
    return result.toLowerCase();
}, (string, options) => `${string}-${options?.locale}-${options?.separator}-${options?.preserveCase}`);
