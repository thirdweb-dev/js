/**
 * @internal
 */
export const stringify: typeof JSON.stringify = (value, replacer, space) => {
  const res = JSON.stringify(
    value,
    (key, value_) => {
      const value__ = typeof value_ === "bigint" ? value_.toString() : value_;
      return typeof replacer === "function" ? replacer(key, value__) : value__;
    },
    space,
  );
  return res;
};
