export const IS_DEV =
  // biome-ignore lint/nursery/noProcessEnv: ok in this file
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
