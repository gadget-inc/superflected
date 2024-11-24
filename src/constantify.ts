import { underscore } from "./underscore";

export function constantify(word: string) {
  return underscore(word)
    .toUpperCase()
    .replace(/\s+/g, "_");
}
