export const validStrList = (
  strList: string,
  validator: RegExp | ((str: string) => boolean),
) => {
  if (strList === "*" || strList.length === 0) {
    return true;
  }
  // comma or new-line separated
  const values = strList.split(/,|\n/);

  const invalid = values.find((str) => {
    return typeof validator === "function"
      ? !validator(str.trim())
      : !validator.test(str.trim());
  });

  return !invalid;
};
