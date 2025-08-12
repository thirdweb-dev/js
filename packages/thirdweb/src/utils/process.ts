// You must use typeof process !== "undefined" instead of just "process"
export const IS_DEV =
  typeof process !== "undefined" &&
  process.env &&
  (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test");

export const IS_TEST =
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV === "test";
