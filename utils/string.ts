export const toArrFromList = (str: string) => {
  if (!str) {
    return [];
  }

  // split by comma or new-line character
  // trim white spaces
  // remove trailing slash
  // remove empty elements
  return str
    .split(/[\n,]/)
    .map((v) => v.trim().replace(/\/$/, ""))
    .filter((v) => v.length > 0);
};

export const fromArrayToList = (arr: string[]) => {
  return arr.join(", ");
};
