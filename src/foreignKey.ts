import { underscore } from "./underscore";

export function foreignKey(className: string, separateWithUnderscore = true) {
  return `${underscore(className)}${separateWithUnderscore ? "_id" : "id"}`;
}
