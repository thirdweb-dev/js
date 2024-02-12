import type { AbiFunction } from "abitype";
import type { Transaction } from "../../transaction.js";
import type { Hex } from "viem";
import { resolveParams } from "../resolve-params.js";
import { encodeAbiFunction } from "../../../abi/encode.js";

type EncodeRawOptions<abiFn extends AbiFunction> = {
  transaction: Transaction<abiFn>;
  abiFunction: abiFn;
};

/**
 * @internal
 */
export async function encodeRaw<const abiFn extends AbiFunction>(
  options: EncodeRawOptions<abiFn>,
): Promise<Hex> {
  const encodePromise = (async () => {
    const { params } = await resolveParams(options.transaction);

    return encodeAbiFunction(options.abiFunction, params ?? []);
  })();

  return encodePromise;
}
