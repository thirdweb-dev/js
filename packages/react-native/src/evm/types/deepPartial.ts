export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export function deepMerge<T>(target: T, source: DeepPartial<T> = {}): T {
  for (const key in source) {
    if (!source.hasOwnProperty(key)) {
      continue;
    }
    if (
      isObject(target) &&
      target.hasOwnProperty(key) &&
      isObject(target[key])
    ) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key] as (typeof target)[typeof key];
    }
  }
  return target;
}

function isObject(obj: any): obj is object {
  return obj !== null && typeof obj === "object";
}
