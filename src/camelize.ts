import { inflections } from "./Inflector";
import type { AhoCorasick } from "./ahoCorasick";
import { capitalize } from "./capitalize";

const separators = /(?:_|(\/))([a-z\d]*)/gi;

export function camelize(term: string, uppercaseFirstLetter = true) {
  const inflector = inflections();

  let result: string = term;

  if (uppercaseFirstLetter) {
    const startAcronym = findLongestStartAcronym(inflector.lowerAcronymMatcher, term);
    if (startAcronym) {
      result = inflector.lowerToAcronyms[startAcronym] + result.slice(startAcronym.length);
    } else {
      result = term.charAt(0).toUpperCase() + term.slice(1);
    }
  } else {
    const startAcronym = findLongestStartAcronym(inflector.casedAcronymMatcher, term);
    if (startAcronym) {
      result = startAcronym.toLowerCase() + result.slice(startAcronym.length);
    } else {
      result = term.charAt(0).toLowerCase() + term.slice(1);
    }
  }

  result = result.replace(separators, (_match, separator, word) => {
    word = inflector.lowerToAcronyms[word] ?? capitalize(word);
    if (separator) {
      return separator + word;
    } else {
      return word;
    }
  });

  return result;
}

const findLongestStartAcronym = (matcher: AhoCorasick | null, word: string) => {
  if (!matcher) return null;

  const results = matcher.search(word, undefined, true);
  if (results.length > 0) {
    return results[0][1];
  }
  return null;
};
