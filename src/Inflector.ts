import { AhoCorasick } from "./ahoCorasick";
import { defaults } from "./defaults";
function icPart(str: string) {
  return str
    .split("")
    .map((c) => `(?:${c.toUpperCase()}|${c.toLowerCase()})`)
    .join("");
}

function remove<T>(arr: T[], elem: T) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === elem) {
      arr.splice(i, 1);
    }
  }
}

/** Stores all the special cases for how words can be inflected */
export class Inflector {
  plurals: [RegExp | string, string][] = [];
  singulars: [RegExp | string, string][] = [];
  uncountables: string[] = [];
  humans: [RegExp | string, string][] = [];
  lowerToAcronyms: Record<string, string> = {};
  casedAcronymMatcher: AhoCorasick | null = null;
  lowerAcronymMatcher: AhoCorasick | null = null;

  acronym(word: string) {
    this.lowerToAcronyms[word.toLowerCase()] = word;
    this.lowerAcronymMatcher = new AhoCorasick(Object.keys(this.lowerToAcronyms));
    this.casedAcronymMatcher = new AhoCorasick(Object.values(this.lowerToAcronyms));
  }

  plural(rule: RegExp | string, replacement: string) {
    if (typeof rule === "string") {
      remove(this.uncountables, rule);
    }

    remove(this.uncountables, replacement);
    this.plurals.unshift([rule, replacement]);
  }

  singular(rule: RegExp | string, replacement: string) {
    if (typeof rule === "string") {
      remove(this.uncountables, rule);
    }

    remove(this.uncountables, replacement);
    this.singulars.unshift([rule, replacement]);
  }

  irregular(singular: string, plural: string) {
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
    } else {
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

  uncountable(...words: string[]) {
    this.uncountables = this.uncountables.concat(words);
  }

  human(rule: RegExp | string, replacement: string) {
    this.humans.unshift([rule, replacement]);
  }

  clear(scope: "all" | "plurals" | "singulars" | "uncountables" | "humans" | "acronyms" = "all") {
    if (scope === "all") {
      this.plurals = [];
      this.singulars = [];
      this.uncountables = [];
      this.humans = [];
      this.lowerToAcronyms = {};
      this.casedAcronymMatcher = null;
      this.lowerAcronymMatcher = null;
    } else if (scope === "acronyms") {
      this.lowerToAcronyms = {};
      this.casedAcronymMatcher = null;
      this.lowerAcronymMatcher = null;
    } else {
      this[scope] = [];
    }
  }
}

const instances: Record<string, Inflector> = {};

export function inflections(locale = "en") {
  instances[locale] ??= new Inflector();
  return instances[locale];
}

export function setInflections(locale: string, fn: (inflector: Inflector) => void) {
  fn(inflections(locale));
}

for (const locale in defaults) {
  setInflections(locale, defaults[locale]);
}
