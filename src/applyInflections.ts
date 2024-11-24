import { inflections } from "./Inflector";

export function applyInflections(word: string, rules: [RegExp | string, string][]) {
  let result = word;
  const inflector = inflections();

  if (result.length === 0) {
    return result;
  }

  const match = result.toLowerCase().match(/\b\w+$/);

  if (match && inflector.uncountables.indexOf(match[0]) > -1) {
    return result;
  } else {
    for (const rule of rules) {
      const [regex, replacement] = rule;

      if (result.match(regex)) {
        result = result.replace(regex, replacement);
        break;
      }
    }

    return result;
  }
}
