import { camelize } from "./camelize";
import { singularize } from "./singularize";

export function classify(tableName: string) {
  return camelize(singularize(tableName.replace(/.*\./g, "")));
}
