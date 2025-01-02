function isAnyObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function removeUndefinedFromObjectDeep<
  T extends Record<string, unknown>,
>(obj: T): T {
  const newObj = {} as T;
  for (const key in obj) {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    } else if (isAnyObject(obj[key])) {
      newObj[key] = removeUndefinedFromObjectDeep(obj[key]);
    }
  }
  return newObj;
}
