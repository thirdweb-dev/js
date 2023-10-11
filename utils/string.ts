export const toArrFromList = (str: string, allowTrailingSlash = false) => {
  if (!str) {
    return [];
  }

  // split by comma or new-line character
  // trim white spaces
  // remove trailing slash
  // remove empty elements
  return str
    .split(/[\n,]/)
    .map((v) => (allowTrailingSlash ? v.trim() : v.trim().replace(/\/$/, "")))
    .filter((v) => v.length > 0);
};

export const fromArrayToList = (arr: string[]) => {
  return arr.join(", ");
};
