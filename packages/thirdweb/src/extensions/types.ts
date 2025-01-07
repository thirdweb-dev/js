import type { Abi } from "abitype";
import type { BaseTransactionOptions } from "../transaction/types.js";

export type Extension<TAbi extends Abi, TParams extends object, TResult> = (
  options: BaseTransactionOptions<TParams, TAbi>,
) => Promise<TResult>;
