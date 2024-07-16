export const PRODUCTS = [
  "connect",
  "engine",
  "contracts",
  "account",
  "other",
] as const;
export type Product = (typeof PRODUCTS)[number];

export function isProduct(value: string): value is Product {
  return PRODUCTS.includes(value as Product);
}
