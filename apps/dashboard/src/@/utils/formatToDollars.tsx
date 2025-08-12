export const formatToDollars = (cents: number) => {
  const dollars = cents / 100;
  return new Intl.NumberFormat(undefined, {
    currency: "USD",
    style: "currency",
  }).format(dollars);
};
