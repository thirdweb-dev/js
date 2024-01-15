export function memoizePromise<T>(fn: () => Promise<T>) {
  let promise: Promise<T> | undefined;
  return () => {
    if (!promise) {
      promise = fn();
    }
    return promise;
  };
}
