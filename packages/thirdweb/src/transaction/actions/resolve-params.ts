import type { AbiFunction, AbiParametersToPrimitiveTypes } from "abitype";
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
 * @internal
 */
export async function resolveParams<const abiFn extends AbiFunction>(
  tx: Transaction<abiFn>,
) {
  if (PARAMS_CACHE.has(tx)) {
    return PARAMS_CACHE.get(tx) as Promise<{
      params: AbiParametersToPrimitiveTypes<abiFn["inputs"]>;
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
      console.log("resolveParams!", result);
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
    params: AbiParametersToPrimitiveTypes<abiFn["inputs"]>;
    overrides: Partial<DynamicTransactionOverrides>;
  }>;
}
