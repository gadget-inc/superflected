"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classify = void 0;
const cache_1 = require("./cache");
const camelize_1 = require("./camelize");
const singularize_1 = require("./singularize");
exports.classify = (0, cache_1.cacheable)((tableName) => (0, camelize_1.camelize)((0, singularize_1.singularize)(tableName.replace(/.*\./g, ""))));
