import { encodeAbiFunction } from "../../abi/encode.js";
import type { AbiFunction } from "abitype";
import type { Transaction } from "../transaction.js";

export async function encode<const abiFn extends AbiFunction>(
  tx: Transaction<abiFn>,
) {
  if (!tx._encoded) {
    tx._encoded = (async function () {
      const [abiFn, params] = await Promise.all([
        tx.abi(),
        typeof tx.params === "function" ? tx.params() : tx.params,
      ]);
      // @ts-expect-error - missing typecheck for inputs actually having a length etc
      return encodeAbiFunction<abiFn>(abiFn, params ?? []);
    })();
  }
  return await tx._encoded;
}
