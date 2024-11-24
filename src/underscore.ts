import { inflections } from "./Inflector";

const letterOrDigit = /[A-Za-z\d]/;
const wordBoundaryOrNonLetter = /\b|[^a-z]/;
const boundaryMatcher = /([A-Z\d]+)([A-Z][a-z])|([a-z\d])([A-Z])|(-)/g;

export function underscore(camelCasedWord: string) {
  let result = camelCasedWord;
  const acronymMatches = inflections().casedAcronymMatcher?.search(camelCasedWord, isWordBoundary);
  if (acronymMatches) {
    acronymMatches.forEach(([pos, match], index) => {
      if (index > 0) {
        pos = pos + index - 1;
      }
      const beforeCharacter = result[pos - match.length];
      const afterCharacter = result[pos + 1];

      if ((pos == match.length - 1 || letterOrDigit.test(beforeCharacter)) && wordBoundaryOrNonLetter.test(afterCharacter)) {
        if (pos > match.length - 1) {
          result = `${result.slice(0, pos - match.length + 1)}_${match.toLowerCase()}${result.slice(pos + 1)}`;
        } else {
          result = `${match.toLowerCase()}${result.slice(pos + 1)}`;
        }
      }
    });
  }

  return result
    .replace(boundaryMatcher, (_match, p1, p2, p3, p4, p5) => {
      if (p1) return `${p1}_${p2}`;
      if (p5) return `_`;
      return `${p3}_${p4}`;
    })
    .toLowerCase();
}

function isWordBoundary(char: string): boolean {
  const charCode = char.charCodeAt(0);
  const isLowercaseLetter = charCode >= 97 && charCode <= 122; // a-z

  return !isLowercaseLetter;
}
