export default function capitalize(str: string | null | undefined) {
  if (str === null || str === undefined) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
