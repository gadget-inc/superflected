"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = capitalize;
function capitalize(str) {
    if (str === null || str === undefined) {
        return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}
