import type { IndexerPagingParams } from "./types.js";

/**
 * @internal
 */
export function addRequestPagination(
  url: URL,
  pagingParams: IndexerPagingParams,
): URL {
  if (pagingParams.start) {
    url.searchParams.append("offset", pagingParams.start.toString());
  }
  if (pagingParams.count) {
    url.searchParams.append("limit", pagingParams.count.toString());
  }
  return url;
}
