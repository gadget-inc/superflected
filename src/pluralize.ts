import { applyInflections } from "./applyInflections";
import { cacheable } from "./cache";
import { inflections } from "./Inflector";

export const pluralize = cacheable(
  (word: string, locale = "en") => applyInflections(word, inflections(locale).plurals),
  (word, locale) => `${word}-${locale}`
);
