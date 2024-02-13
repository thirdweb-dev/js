import type {
  AbiFunction,
  AbiParameter,
  AbiParametersToPrimitiveTypes,
} from "abitype";
import type {
  Transaction,
  DynamicTransactionOverrides,
} from "../transaction.js";
import { isObjectWithKeys } from "../../utils/type-guards.js";

const PARAMS_CACHE = new WeakMap();

/**
 * Resolves the parameters for a transaction.
 *
 * @param tx - The transaction object.
 * @returns A promise that resolves to an object containing the resolved parameters and overrides.
 * @throws An error if the parameters are invalid.
 * @transaction
 * @internal
 */
export async function resolveParams<
  const abiFn extends AbiFunction,
  const TParams = AbiParametersToPrimitiveTypes<abiFn["inputs"]>,
>(
  tx: Transaction<abiFn>,
): Promise<{
  params: TParams extends readonly AbiParameter[] ? TParams : never;
  overrides: Partial<DynamicTransactionOverrides>;
}> {
  if (PARAMS_CACHE.has(tx)) {
    return PARAMS_CACHE.get(tx) as Promise<{
      params: TParams extends readonly AbiParameter[] ? TParams : never;
      overrides: Partial<DynamicTransactionOverrides>;
    }>;
  }
  let paramsPromise;
  if (!tx.params) {
    paramsPromise = Promise.resolve({
      params: [],
      overrides: {},
    });
  } else if (typeof tx.params !== "function") {
    paramsPromise = Promise.resolve({
      params: tx.params,
      overrides: {},
    });
  } else {
    paramsPromise = tx.params().then((result) => {
      // handle return case: result === params[]
      if (Array.isArray(result)) {
        return {
          params: result,
          overrides: {},
        };
      } // handle return case: result === { params: params[], overrides: overrides }
      if (isObjectWithKeys(result, ["params", "overrides"])) {
        return {
          params: result.params,
          overrides: result.overrides,
        };
      }
      // this should never be hit
      throw new Error("invalid params") as never;
    });
  }

  PARAMS_CACHE.set(tx, paramsPromise);
  return paramsPromise as Promise<{
    params: TParams extends readonly AbiParameter[] ? TParams : never;
    overrides: Partial<DynamicTransactionOverrides>;
  }>;
}
