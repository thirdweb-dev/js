export function getProcessEnv(key: string, defaultValue = "") {
  if (typeof process !== undefined) {
    if (process.env[key]) {
      return process.env[key] as string;
    }
  }

  return defaultValue;
}

export function setProcessEnv(key: string, value: string) {
  if (typeof process !== undefined) {
    process.env[key] = value;
  }
}
