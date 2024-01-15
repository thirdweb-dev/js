import { resolveAbiFunction } from "../../abi/resolveAbiFunction.js";
import type { Transaction } from "../types.js";

export async function resolveAbi<const tx extends Transaction>(tx: tx) {
  if (!tx._abiFn) {
    tx._abiFn = resolveAbiFunction(tx.contract, tx.options);
  }
  return await tx._abiFn;
}
