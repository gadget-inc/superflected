"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleize = titleize;
const humanize_1 = require("./humanize");
const underscore_1 = require("./underscore");
function titleize(word) {
    return (0, humanize_1.humanize)((0, underscore_1.underscore)(word)).replace(/(^|[\s¿/]+)([a-z])/g, function (match, boundary, letter, idx, string) {
        return match.replace(letter, letter.toUpperCase());
    });
}
