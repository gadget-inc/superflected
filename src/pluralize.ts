import { applyInflections } from "./applyInflections";
import { inflections } from "./Inflector";

export default function pluralize(word: string, locale = "en") {
  return applyInflections(word, inflections(locale).plurals);
}
