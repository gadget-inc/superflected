import { inflections } from "./Inflector";
import capitalize from "./capitalize";

export default function camelize(term: string, uppercaseFirstLetter = true) {
  let result = "" + term;

  if (uppercaseFirstLetter) {
    result = result.replace(/^[a-z\d]*/, function(a) {
      return inflections().acronyms[a] || capitalize(a);
    });
  } else {
    result = result.replace(new RegExp("^(?:" + inflections().acronymRegex.source + "(?=\\b|[A-Z_])|\\w)"), function(a) {
      return a.toLowerCase();
    });
  }

  result = result.replace(/(?:_|(\/))([a-z\d]*)/gi, function(match, a, b, idx, string) {
    a || (a = "");
    return "" + a + (inflections().acronyms[b] || capitalize(b));
  });

  return result;
}
