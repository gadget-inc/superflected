import underscore from "./underscore";

export default function constantify(word: string) {
  return underscore(word)
    .toUpperCase()
    .replace(/\s+/g, "_");
}
