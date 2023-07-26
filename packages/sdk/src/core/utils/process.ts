export function getProcessEnv(key: string, defaultValue = "") {
  if (typeof process !== "undefined") {
    if (process.env[key]) {
      return process.env[key] as string;
    }
  }

  return defaultValue;
}
