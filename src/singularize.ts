import { applyInflections } from "./applyInflections";
import { cacheable } from "./cache";
import { inflections } from "./Inflector";

export const singularize = cacheable(
  (word: string, locale = "en") => applyInflections(word, inflections(locale).singulars),
  (word, locale) => `${word}-${locale}`
);
