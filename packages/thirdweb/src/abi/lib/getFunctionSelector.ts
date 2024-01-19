import type { AbiFunction } from "abitype";
import { getFunctionSignature } from "./getFunctionSignature.js";
import { slice } from "viem/utils";
import type { Hash } from "viem";
import { keccak_256 } from "@noble/hashes/sha3";
import { uint8ArrayToHex } from "../../utils/uint8-array.js";

const hash = (value: string) =>
  `0x${uint8ArrayToHex(keccak_256(value))}` as const;

const FN_SELECTOR_CACHE = /*@__PURE__*/ new Map<string, Hash>();

export function getFunctionSelector(fn: string | AbiFunction): Hash {
  const normalizedFn = getFunctionSignature(fn);
  // if we have already computed the function selector before, return it
  if (FN_SELECTOR_CACHE.has(normalizedFn)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return FN_SELECTOR_CACHE.get(normalizedFn)!;
  }
  const functionSelector = slice(hash(normalizedFn), 0, 4);
  FN_SELECTOR_CACHE.set(normalizedFn, functionSelector);
  return functionSelector;
}
