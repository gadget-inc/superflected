"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelize = void 0;
const Inflector_1 = require("./Inflector");
const cache_1 = require("./cache");
const capitalize_1 = require("./capitalize");
const separators = /(?:_|(\/))([a-z\d]*)/gi;
exports.camelize = (0, cache_1.cacheable)((term, uppercaseFirstLetter = true) => {
    const inflector = (0, Inflector_1.inflections)();
    let result = term;
    if (uppercaseFirstLetter) {
        const startAcronym = findLongestStartAcronym(inflector.lowerAcronymMatcher, term);
        if (startAcronym) {
            result = inflector.lowerToAcronyms[startAcronym] + result.slice(startAcronym.length);
        }
        else {
            result = term.charAt(0).toUpperCase() + term.slice(1);
        }
    }
    else {
        const startAcronym = findLongestStartAcronym(inflector.casedAcronymMatcher, term);
        if (startAcronym) {
            result = startAcronym.toLowerCase() + result.slice(startAcronym.length);
        }
        else {
            result = term.charAt(0).toLowerCase() + term.slice(1);
        }
    }
    result = result.replace(separators, (_match, separator, word) => {
        word = inflector.lowerToAcronyms[word] ?? (0, capitalize_1.capitalize)(word);
        if (separator) {
            return separator + word;
        }
        else {
            return word;
        }
    });
    return result;
}, (term, uppercaseFirstLetter) => `${term}-${uppercaseFirstLetter}`);
const findLongestStartAcronym = (matcher, word) => {
    if (!matcher)
        return null;
    const results = matcher.search(word, undefined, true);
    if (results.length > 0) {
        return results[0][1];
    }
    return null;
};
