"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableize = tableize;
const pluralize_1 = require("./pluralize");
const underscore_1 = require("./underscore");
function tableize(className) {
    return (0, pluralize_1.pluralize)((0, underscore_1.underscore)(className));
}
