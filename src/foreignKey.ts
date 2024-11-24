import underscore from "./underscore";

export default function foreignKey(className: string, separateWithUnderscore = true) {
  return `${underscore(className)}${separateWithUnderscore ? "_id" : "id"}`;
}
