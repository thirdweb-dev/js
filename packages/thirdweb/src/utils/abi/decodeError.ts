import type * as ox__Abi from "ox/Abi";
import * as ox__AbiError from "ox/AbiError";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import type { Hex } from "../encoding/hex.js";

/**
 * Decodes an error.
 * @param options - The options object.
 * @returns The decoded error.
 * @example
 * ```ts
 * import { decodeError } from "thirdweb/utils";
 *
 * const data = "0x...";
 * const error = await decodeError({ contract, data });
 * ```
 *
 * @utils
 */
export async function decodeError<abi extends ox__Abi.Abi>(options: {
  contract: ThirdwebContract<abi>;
  data: Hex;
}) {
  const { contract, data } = options;
  let abi = contract?.abi;
  if (contract && !abi) {
    abi = await resolveContractAbi(contract).catch(() => undefined);
  }
  if (!abi) {
    throw new Error(
      `No ABI found for contract ${contract.address} on chain ${contract.chain.id}`,
    );
  }
  const abiError = ox__AbiError.fromAbi(abi, data) as ox__AbiError.AbiError;
  return ox__AbiError.decode(abiError, data);
}
