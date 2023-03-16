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
