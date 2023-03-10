export const uniqueBy = (
  arr: any[],
  iteratee: string | ((item: any) => any),
) => {
  let parsedIteratee: (item: any) => any;

  if (typeof iteratee === "string") {
    const prop = iteratee;
    parsedIteratee = (item) => item[prop];
  }

  return arr.filter(
    (x, i, self) =>
      i === self.findIndex((y) => parsedIteratee(x) === parsedIteratee(y)),
  );
};
