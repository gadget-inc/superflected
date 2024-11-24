import { cacheable } from "./cacheable";
import { underscore } from "./underscore";

export const constantify = cacheable((word: string) => {
  return underscore(word).toUpperCase().replace(/\s+/g, "_");
});
