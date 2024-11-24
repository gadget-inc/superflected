import { applyInflections } from "./applyInflections";
import { inflections } from "./Inflector";

export function pluralize(word: string, locale = "en") {
  return applyInflections(word, inflections(locale).plurals);
}
