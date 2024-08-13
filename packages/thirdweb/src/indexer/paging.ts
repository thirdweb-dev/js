import type { IndexerPagingParams } from "./types.js";

/**
 * @internal
 */
export function addRequestPagination(
  url: URL,
  pagingParams: IndexerPagingParams,
): URL {
  if (pagingParams.page) {
    url.searchParams.append("page", pagingParams.page.toString());
  }
  if (pagingParams.pageSize) {
    url.searchParams.append("pageSize", pagingParams.pageSize.toString());
  }
  return url;
}
