import { cacheable } from "./cache";
import { underscore } from "./underscore";

export const constantify = cacheable((word: string) => {
  return underscore(word).toUpperCase().replace(/\s+/g, "_");
});
