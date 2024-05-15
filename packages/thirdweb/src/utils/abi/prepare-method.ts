import { type AbiFunction, type ParseAbiItem, parseAbiItem } from "abitype";
import { toFunctionSelector } from "viem";
import { LruMap } from "../caching/lru.js";
import type { Hex } from "../encoding/hex.js";
import { stringify } from "../json.js";

type ParseMethod<method extends AbiFunction | `function ${string}`> =
  // if the method IS an AbiFunction, return it
  method extends AbiFunction
    ? method
    : method extends `function ${string}`
      ? ParseAbiItem<method> extends AbiFunction
        ? ParseAbiItem<method>
        : never
      : never;

export type PreparedMethod<TMethod extends AbiFunction | `function ${string}`> =
  // ["fn signature", "inputs", "outputs"]
  [Hex, ParseMethod<TMethod>["inputs"], ParseMethod<TMethod>["outputs"]];

const prepareMethodCache = new LruMap<PreparedMethod<AbiFunction>>(4096);

/**
 * Prepares a method for usage by converting it into a prepared method object.
 * @param method The method to prepare.
 * @returns The prepared method object.
 * @example
 * ```ts
 * import { prepareMethod } from "thirdweb/utils";
 * const method = "function transfer(address to, uint256 value)";
 * const preparedMethod = prepareMethod(method);
 * ```
 * @contract
 */
export function prepareMethod<
  const TMethod extends AbiFunction | `function ${string}`,
>(method: TMethod): PreparedMethod<TMethod> {
  const key = typeof method === "string" ? method : stringify(method);
  if (prepareMethodCache.has(key)) {
    return prepareMethodCache.get(key) as PreparedMethod<TMethod>;
  }
  type ParsedAbiFn = ParseMethod<TMethod>;

  const abiFn =
    typeof method === "string"
      ? // @ts-expect-error - we're sure it's a string...
        (parseAbiItem(method) as ParsedAbiFn)
      : (method as ParsedAbiFn);

  // encode the method signature
  const sig = toFunctionSelector(abiFn);

  const ret: PreparedMethod<TMethod> = [sig, abiFn.inputs, abiFn.outputs];
  prepareMethodCache.set(key, ret);
  return ret;
}
