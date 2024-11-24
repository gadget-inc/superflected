import { inflections } from "./Inflector";

export function applyInflections(word: string, rules: [RegExp | string, string][]) {
  let result = "" + word,
    rule,
    regex,
    replacement;

  if (result.length === 0) {
    return result;
  } else {
    const match = result.toLowerCase().match(/\b\w+$/);

    if (match && inflections().uncountables.indexOf(match[0]) > -1) {
      return result;
    } else {
      for (let i = 0, ii = rules.length; i < ii; i++) {
        rule = rules[i];

        regex = rule[0];
        replacement = rule[1];

        if (result.match(regex)) {
          result = result.replace(regex, replacement);
          break;
        }
      }

      return result;
    }
  }
}
