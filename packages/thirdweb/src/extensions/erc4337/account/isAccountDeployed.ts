import { getContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import * as PredictAddress from "../__generated__/IAccountFactory/read/getAddress.js";

export {
  type GetAddressParams as IsAccountDeployedParams,
  isGetAddressSupported as isIsAccountDeployedSupported,
} from "../__generated__/IAccountFactory/read/getAddress.js";

/**
 * Adds admin permissions for a specified address.
 * @param options - The options for the addAdmin function.
 * @returns The transaction object to be sent.
 * @example
 * ```ts
 * import { isAccountDeployed } from 'thirdweb/extensions/erc4337';
 *
 * const isDeployed = await isAccountDeployed({
 * contract,
 * account,
 * adminSigner: '0x...'
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
  return isContractDeployed(
    getContract({
      ...options.contract,
      address: predictedAddress,
    }),
  );
}
