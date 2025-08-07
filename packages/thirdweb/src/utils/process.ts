export const IS_DEV =
  process &&
  (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test");

export const IS_TEST = process && process.env.NODE_ENV === "test";
