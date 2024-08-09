import type { ChainsawPagingParams } from "./types.js";

/**
 * @internal
 */
export function addRequestPagination(
  url: URL,
  pagingParams: ChainsawPagingParams,
): URL {
  if (pagingParams.page) {
    url.searchParams.append("page", pagingParams.page.toString());
  }
  if (pagingParams.pageSize) {
    url.searchParams.append("pageSize", pagingParams.pageSize.toString());
  }
  return url;
}
