"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordinalize = ordinalize;
const ordinal_1 = require("./ordinal");
function ordinalize(number) {
    return `${number}${(0, ordinal_1.ordinal)(number)}`;
}
