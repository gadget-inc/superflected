"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyInflections = applyInflections;
const Inflector_1 = require("./Inflector");
function applyInflections(word, rules) {
    let result = word;
    const inflector = (0, Inflector_1.inflections)();
    if (result.length === 0) {
        return result;
    }
    const match = result.toLowerCase().match(/\b\w+$/);
    if (match && inflector.uncountables.indexOf(match[0]) > -1) {
        return result;
    }
    else {
        for (const rule of rules) {
            const [regex, replacement] = rule;
            if (result.match(regex)) {
                result = result.replace(regex, replacement);
                break;
            }
        }
        return result;
    }
}
