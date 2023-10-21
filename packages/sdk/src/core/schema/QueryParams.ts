import { z } from "zod";

/**
 * @internal
 */
export const DEFAULT_QUERY_ALL_COUNT = 100;

export const QueryAllParamsSchema = /* @__PURE__ */ (() =>
  z
    .object({
      start: z.number().default(0),
      count: z.number().default(DEFAULT_QUERY_ALL_COUNT),
      loadMetadata: z.boolean().default(true),
    })
    .default({
      start: 0,
      count: DEFAULT_QUERY_ALL_COUNT,
      loadMetadata: true,
    }))();

/**
 * Pagination Parameters
 * @public
 */
export type QueryAllParams = Exclude<
  z.input<typeof QueryAllParamsSchema>,
  undefined
>;
