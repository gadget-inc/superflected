import { inflections } from "./Inflector";

export function humanize(lowerCaseAndUnderscoredWord: string, options?: { capitalize?: boolean }) {
  let result = "" + lowerCaseAndUnderscoredWord;
  const humans = inflections().humans;
  let human, rule, replacement;

  options = options || {};

  if (options.capitalize === null || options.capitalize === undefined) {
    options.capitalize = true;
  }

  for (let i = 0, ii = humans.length; i < ii; i++) {
    human = humans[i];
    rule = human[0];
    replacement = human[1];

    if (rule instanceof RegExp ? rule.test(result) : result.indexOf(rule) > -1) {
      result = result.replace(rule, replacement);
      break;
    }
  }

  result = result.replace(/_id$/, "");
  result = result.replace(/_/g, " ");

  result = result.replace(/([a-z\d]*)/gi, function (match) {
    return inflections().lowerToAcronyms[match] || match.toLowerCase();
  });

  if (options.capitalize) {
    result = result.replace(/^\w/, function (match) {
      return match.toUpperCase();
    });
  }

  return result;
}
