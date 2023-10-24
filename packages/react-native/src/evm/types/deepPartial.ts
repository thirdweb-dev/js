export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  for (const key in source) {
    if (
      source[key] instanceof Object &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      key in target &&
      target[key] instanceof Object
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key] as any;
    }
  }
  return target;
}
