import { encodeAbiFunction } from "../../abi/encode.js";
import type { Transaction } from "../types.js";
import { resolveAbi } from "./resolveAbiFn.js";

export async function encode<const tx extends Transaction>(tx: tx) {
  if (!tx._encoded) {
    tx._encoded = (async function () {
      const [abiFn, params] = await Promise.all([
        resolveAbi(tx),
        typeof tx.options.params === "function"
          ? tx.options.params()
          : tx.options.params,
      ]);
      return encodeAbiFunction(abiFn, params);
    })();
  }
  return await tx._encoded;
}
