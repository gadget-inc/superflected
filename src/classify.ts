import { cacheable } from "./cache";
import { camelize } from "./camelize";
import { singularize } from "./singularize";

export const classify = cacheable((tableName: string) => camelize(singularize(tableName.replace(/.*\./g, ""))));
