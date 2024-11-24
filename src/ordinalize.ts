import ordinal from "./ordinal";

export default function ordinalize(number: string | number) {
  return `${number}${ordinal(number)}`;
}
