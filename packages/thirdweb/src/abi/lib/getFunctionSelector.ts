import type { AbiFunction } from "abitype";
import { getFunctionSignature } from "./getFunctionSignature.js";
import { toFunctionSelector } from "viem";
import type { Hash } from "viem";

const FN_SELECTOR_CACHE = /*@__PURE__*/ new Map<string, Hash>();

/**
 * Computes the function selector for a given function name or AbiFunction object.
 *
 * @param fn - The function name or AbiFunction object.
 * @returns The computed function selector.
 * @internal
 */
export function getFunctionSelector(fn: string | AbiFunction): Hash {
  const normalizedFn = getFunctionSignature(fn);
  // if we have already computed the function selector before, return it
  if (FN_SELECTOR_CACHE.has(normalizedFn)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return FN_SELECTOR_CACHE.get(normalizedFn)!;
  }
  const functionSelector = toFunctionSelector(normalizedFn);
  FN_SELECTOR_CACHE.set(normalizedFn, functionSelector);
  return functionSelector;
}
