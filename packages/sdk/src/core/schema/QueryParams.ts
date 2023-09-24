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
    })
    .default({
      start: 0,
      count: DEFAULT_QUERY_ALL_COUNT,
    }))();

/**
 * Pagination Parameters
 * @public
 */
export type QueryAllParams = Exclude<
  z.input<typeof QueryAllParamsSchema>,
  undefined
>;

export const QueryOwnedParamsSchema = /* @__PURE__ */ (() =>
  z
    .object({
      page: z
        .number()
        .refine((value) => value > 0, "Page must start at 1")
        .default(1),
      count: z
        .number()
        .refine((value) => value > 0, "Count must be greater than 0")
        .default(DEFAULT_QUERY_ALL_COUNT),
    })
    .default({
      page: 1,
      count: DEFAULT_QUERY_ALL_COUNT,
    }))();

/**
 * Pagination Parameters for querying owned NFTs from an address
 * `page` starts at 1
 * @public
 */
export type QueryOwnedParams = Exclude<
  z.input<typeof QueryOwnedParamsSchema>,
  undefined
>;
