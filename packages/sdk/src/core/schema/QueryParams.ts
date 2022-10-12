/**
 * @internal
 */
export const DEFAULT_QUERY_ALL_COUNT = 100;

/**
 * Pagination Parameters
 * @public
 */
export interface QueryAllParams {
  /**
   * the index to start from (default: 0)
   */
  start?: number;
  /**
   * how many items to return (default: 100)
   */
  count?: number;
}
