"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inflector = void 0;
exports.inflections = inflections;
exports.setInflections = setInflections;
const ahoCorasick_1 = require("./ahoCorasick");
const defaults_1 = require("./defaults");
function icPart(str) {
    return str
        .split("")
        .map((c) => `(?:${c.toUpperCase()}|${c.toLowerCase()})`)
        .join("");
}
function remove(arr, elem) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === elem) {
            arr.splice(i, 1);
        }
    }
}
/** Stores all the special cases for how words can be inflected */
class Inflector {
    constructor() {
        this.plurals = [];
        this.singulars = [];
        this.uncountables = [];
        this.humans = [];
        this.lowerToAcronyms = {};
        this.casedAcronymMatcher = null;
        this.lowerAcronymMatcher = null;
    }
    acronym(word) {
        this.lowerToAcronyms[word.toLowerCase()] = word;
        this.lowerAcronymMatcher = new ahoCorasick_1.AhoCorasick(Object.keys(this.lowerToAcronyms));
        this.casedAcronymMatcher = new ahoCorasick_1.AhoCorasick(Object.values(this.lowerToAcronyms));
    }
    plural(rule, replacement) {
        if (typeof rule === "string") {
            remove(this.uncountables, rule);
        }
        remove(this.uncountables, replacement);
        this.plurals.unshift([rule, replacement]);
    }
    singular(rule, replacement) {
        if (typeof rule === "string") {
            remove(this.uncountables, rule);
        }
        remove(this.uncountables, replacement);
        this.singulars.unshift([rule, replacement]);
    }
    irregular(singular, plural) {
        remove(this.uncountables, singular);
        remove(this.uncountables, plural);
        const s0 = singular[0];
        const sRest = singular.substr(1);
        const p0 = plural[0];
        const pRest = plural.substr(1);
        if (s0.toUpperCase() === p0.toUpperCase()) {
            this.plural(new RegExp("(" + s0 + ")" + sRest + "$", "i"), "$1" + pRest);
            this.plural(new RegExp("(" + p0 + ")" + pRest + "$", "i"), "$1" + pRest);
            this.singular(new RegExp("(" + s0 + ")" + sRest + "$", "i"), "$1" + sRest);
            this.singular(new RegExp("(" + p0 + ")" + pRest + "$", "i"), "$1" + sRest);
        }
        else {
            const sRestIC = icPart(sRest);
            const pRestIC = icPart(pRest);
            this.plural(new RegExp(s0.toUpperCase() + sRestIC + "$"), p0.toUpperCase() + pRest);
            this.plural(new RegExp(s0.toLowerCase() + sRestIC + "$"), p0.toLowerCase() + pRest);
            this.plural(new RegExp(p0.toUpperCase() + pRestIC + "$"), p0.toUpperCase() + pRest);
            this.plural(new RegExp(p0.toLowerCase() + pRestIC + "$"), p0.toLowerCase() + pRest);
            this.singular(new RegExp(s0.toUpperCase() + sRestIC + "$"), s0.toUpperCase() + sRest);
            this.singular(new RegExp(s0.toLowerCase() + sRestIC + "$"), s0.toLowerCase() + sRest);
            this.singular(new RegExp(p0.toUpperCase() + pRestIC + "$"), s0.toUpperCase() + sRest);
            this.singular(new RegExp(p0.toLowerCase() + pRestIC + "$"), s0.toLowerCase() + sRest);
        }
    }
    uncountable(...words) {
        this.uncountables = this.uncountables.concat(words);
    }
    human(rule, replacement) {
        this.humans.unshift([rule, replacement]);
    }
    clear(scope = "all") {
        if (scope === "all") {
            this.plurals = [];
            this.singulars = [];
            this.uncountables = [];
            this.humans = [];
            this.lowerToAcronyms = {};
            this.casedAcronymMatcher = null;
            this.lowerAcronymMatcher = null;
        }
        else if (scope === "acronyms") {
            this.lowerToAcronyms = {};
            this.casedAcronymMatcher = null;
            this.lowerAcronymMatcher = null;
        }
        else {
            this[scope] = [];
        }
    }
}
exports.Inflector = Inflector;
const instances = {};
function inflections(locale = "en") {
    instances[locale] ?? (instances[locale] = new Inflector());
    return instances[locale];
}
function setInflections(locale, fn) {
    fn(inflections(locale));
}
for (const locale in defaults_1.defaults) {
    setInflections(locale, defaults_1.defaults[locale]);
}
