type OnceFn<T> = () => Promise<T>;

export function once<const T>(fn: OnceFn<T>): OnceFn<T> {
  let result: Promise<T>;
  return () => {
    if (!result) {
      result = fn();
    }
    return result;
  };
}
