"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constantify = void 0;
const cache_1 = require("./cache");
const underscore_1 = require("./underscore");
exports.constantify = (0, cache_1.cacheable)((word) => {
    return (0, underscore_1.underscore)(word).toUpperCase().replace(/\s+/g, "_");
});
