import { z } from "zod";

/**
 * @internal
 */
export const DEFAULT_QUERY_ALL_COUNT = 100;

export const QueryAllParamsSchema = z
  .object({
    start: z.number().default(0),
    count: z.number().default(DEFAULT_QUERY_ALL_COUNT),
  })
  .default({
    start: 0,
    count: DEFAULT_QUERY_ALL_COUNT,
  });

/**
 * Pagination Parameters
 * @public
 */
export type QueryAllParams = Exclude<
  z.input<typeof QueryAllParamsSchema>,
  undefined
>;
