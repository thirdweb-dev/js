import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import type { PreparedTransaction } from "../../../../../transaction/prepare-transaction.js";
import type { Address } from "../../../../../utils/address.js";
import type { Account } from "../../../../../wallets/interfaces/wallet.js";
import { getOrDeployModule } from "../../../common/getOrDeployModule.js";
import { installPublishedModule } from "../../../common/installPublishedModule.js";
import {
  type EncodeBytesOnInstallParams,
  encodeBytesOnInstallParams,
} from "../encode/encodeBytesOnInstall.js";

const contractId = "ClaimableERC20";

/**
 * Convenience function to add the ClaimableERC20 module as a default module on a core contract.
 * @param params - The parameters for the module.
 * @returns - The module function.
 * @example
 * ```ts
 * import { ClaimableERC20, deployModularContract } from "thirdweb/modules";
 *
 * const deployed = deployModularContract({
 *   client,
 *   chain,
 *   account,
 *   core: "ERC20",
 *   params: {
 *     name: "My Modular Contract",
 *   },
 *   modules: [
 *     ClaimableERC20.module({
 *        primarySaleRecipient: ...,
 *     }),
 *   ],
 * });
 * ```
 * @modules ClaimableERC20
 */
export function module(
  params: EncodeBytesOnInstallParams & { publisher?: string },
) {
  return async (args: {
    client: ThirdwebClient;
    chain: Chain;
    account: Account;
  }) => {
    // deploys if needed
    const moduleContract = await getOrDeployModule({
      account: args.account,
      chain: args.chain,
      client: args.client,
      contractId,
      publisher: params?.publisher,
    });
    return {
      data: encodeInstall(params),
      module: moduleContract.address as Address,
    };
  };
}

/**
 * Installs the ClaimableERC20 module on a core contract.
 * @param options
 * @returns the transaction to install the module
 * @example
 * ```ts
 * import { ClaimableERC20 } from "thirdweb/modules";
 *
 * const transaction  = ClaimableERC20.install({
 *  contract: coreContract,
 *  account: account,
 *  params: {
 *     primarySaleRecipient: ...,
 *  },
 * });
 *
 * await sendTransaction({
 *  transaction,
 *  account,
 * });
 * ```
 * @modules ClaimableERC20
 */
export function install(options: {
  contract: ThirdwebContract;
  account: Account;
  params: EncodeBytesOnInstallParams & { publisher?: string };
}): PreparedTransaction {
  return installPublishedModule({
    account: options.account,
    contract: options.contract,
    moduleData: encodeInstall(options.params),
    moduleName: contractId,
    publisher: options.params?.publisher,
  });
}

/**
 * Encodes the install data for the ClaimableERC20 module.
 * @param params - The parameters for the module.
 * @returns - The encoded data.
 * @modules ClaimableERC20
 */
export function encodeInstall(params: EncodeBytesOnInstallParams) {
  return encodeBytesOnInstallParams(params);
}
