import type { Prettify } from "../../../utils/type-utils.js";

type BasePickedQueryOptions<T = object> = T & {
  enabled?: boolean;
};

export type PickedOnceQueryOptions = Prettify<
  BasePickedQueryOptions & { refetchInterval?: number; retry?: number }
>;

export type WithPickedOnceQueryOptions<T> = T & {
  queryOptions?: PickedOnceQueryOptions;
};
