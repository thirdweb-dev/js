import type { ParsedUrlQuery } from "node:querystring";

/**
 * @deprecated use `SearchParams` instead
 */
export function getSingleQueryValue(
  query: ParsedUrlQuery,
  key: string,
): string | undefined {
  const _val = query[key];

  return Array.isArray(_val) ? _val[0] : _val;
}
