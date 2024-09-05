import { getBytecode } from "../../../contract/actions/get-bytecode.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import * as PredictAddress from "../__generated__/IAccountFactory/read/getAddress.js";

export {
  isGetAddressSupported as isIsAccountDeployedSupported,
  type GetAddressParams as IsAccountDeployedParams,
} from "../__generated__/IAccountFactory/read/getAddress.js";

/**
 * Adds admin permissions for a specified address.
 * @param options - The options for the addAdmin function.
 * @returns The transaction object to be sent.
 * @example
 * ```ts
 * import { isAccountDeployed } from 'thirdweb/extensions/erc4337';
 *
 * const transaction = addAdmin({
 * contract,
 * account,
 * adminAddress: '0x...'
 * });
 *
 * await isAccountDeployed({ contract, adminSigner });
 * ```
 * @extension ERC4337
 */
export async function isAccountDeployed(
  options: BaseTransactionOptions<PredictAddress.GetAddressParams>,
): Promise<boolean> {
  const predictedAddress = await PredictAddress.getAddress(options);
  const bytecode = await getBytecode({
    ...options.contract,
    address: predictedAddress,
  });
  return bytecode !== "0x";
}
