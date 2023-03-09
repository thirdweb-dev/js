import { __DEV__ } from "./constants/runtime";

const warnSet = new Set<`${string}:${string}`>();

export function showDeprecationWarning(
  deprecated: string,
  replacement: string,
) {
  // deprecation warnings only in dev only in dev
  if (__DEV__) {
    if (warnSet.has(`${deprecated}:${replacement}`)) {
      return;
    }
    warnSet.add(`${deprecated}:${replacement}`);
    console.warn(
      `\`${deprecated}\` is deprecated and will be removed in a future major version. Please use \`${replacement}\` instead.`,
    );
  }
}

// it rejects the promise if the given promise does not resolve within the given time
export const timeoutPromise = <T>(
  ms: number,
  promise: Promise<T>,
  errorMessage: string,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage));
    }, ms);
    promise.then(resolve, reject);
  });
};
