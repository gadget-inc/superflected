"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foreignKey = foreignKey;
const underscore_1 = require("./underscore");
function foreignKey(className, separateWithUnderscore = true) {
    return `${(0, underscore_1.underscore)(className)}${separateWithUnderscore ? "_id" : "id"}`;
}
