"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluralize = void 0;
const applyInflections_1 = require("./applyInflections");
const cache_1 = require("./cache");
const Inflector_1 = require("./Inflector");
exports.pluralize = (0, cache_1.cacheable)((word, locale = "en") => (0, applyInflections_1.applyInflections)(word, (0, Inflector_1.inflections)(locale).plurals), (word, locale) => `${word}-${locale}`);
