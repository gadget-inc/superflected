"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.humanize = void 0;
const Inflector_1 = require("./Inflector");
const cache_1 = require("./cache");
exports.humanize = (0, cache_1.cacheable)((lowerCaseAndUnderscoredWord, options) => {
    let result = "" + lowerCaseAndUnderscoredWord;
    const inflector = (0, Inflector_1.inflections)();
    const humans = inflector.humans;
    let human, rule, replacement;
    options = options || {};
    if (options.capitalize === null || options.capitalize === undefined) {
        options.capitalize = true;
    }
    for (let i = 0, ii = humans.length; i < ii; i++) {
        human = humans[i];
        rule = human[0];
        replacement = human[1];
        if (rule instanceof RegExp ? rule.test(result) : result.indexOf(rule) > -1) {
            result = result.replace(rule, replacement);
            break;
        }
    }
    result = result.replace(/_id$/, "");
    result = result.replace(/_/g, " ");
    result = result.replace(/([a-z\d]*)/gi, function (match) {
        return inflector.lowerToAcronyms[match] || match.toLowerCase();
    });
    if (options.capitalize) {
        result = result.replace(/^\w/, function (match) {
            return match.toUpperCase();
        });
    }
    return result;
}, (lowerCaseAndUnderscoredWord, options) => `${lowerCaseAndUnderscoredWord}-${options?.capitalize}`);
