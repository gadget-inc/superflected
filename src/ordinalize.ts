import { ordinal } from "./ordinal";

export function ordinalize(number: string | number) {
  return `${number}${ordinal(number)}`;
}
