import pluralize from "./pluralize";
import underscore from "./underscore";

export default function tableize(className: string) {
  return pluralize(underscore(className));
}
