import { applyInflections } from "./applyInflections";
import { inflections } from "./Inflector";

export function singularize(word: string, locale = "en") {
  return applyInflections(word, inflections(locale).singulars);
}
