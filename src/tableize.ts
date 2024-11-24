import { pluralize } from "./pluralize";
import { underscore } from "./underscore";

export function tableize(className: string) {
  return pluralize(underscore(className));
}
