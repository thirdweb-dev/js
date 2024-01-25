import { encodeAbiFunction } from "../../abi/encode.js";
import type { AbiFunction } from "abitype";
import type { Transaction } from "../transaction.js";
import { resolveAbi } from "./resolve-abi.js";
import type { Hex } from "viem";

const ENCODE_CACHE = new WeakMap();

export async function encode<const abiFn extends AbiFunction>(
  tx: Transaction<abiFn>,
) {
  if (ENCODE_CACHE.has(tx)) {
    return ENCODE_CACHE.get(tx) as Hex;
  }

  const prom = (async () => {
    const [abiFn, params] = await Promise.all([
      resolveAbi(tx),
      typeof tx.params === "function" ? tx.params() : tx.params,
    ]);

    return encodeAbiFunction(abiFn, params ?? []);
  })();

  ENCODE_CACHE.set(tx, prom);
  return prom;
}
