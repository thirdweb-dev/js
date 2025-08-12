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

const contractId = "MintableERC721";

/**
 * Convenience function to add the MintableERC721 module as a default module on a core contract.
 * @param params - The parameters for the module.
 * @returns - The module function.
 * @example
 * ```ts
 * import { MintableERC721, deployModularContract } from "thirdweb/modules";
 *
 * const deployed = deployModularContract({
 *   client,
 *   chain,
 *   account,
 *   core: "ERC721",
 *   params: {
 *     name: "My Modular Contract",
 *   },
 *   modules: [
 *     MintableERC721.module({
 *        primarySaleRecipient: ...,
 *     }),
 *   ],
 * });
 * ```
 * @modules MintableERC721
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
 * Installs the MintableERC721 module on a core contract.
 * @param options
 * @returns the transaction to install the module
 * @example
 * ```ts
 * import { MintableERC721 } from "thirdweb/modules";
 *
 * const transaction  = MintableERC721.install({
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
 * @modules MintableERC721
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
 * Encodes the install data for the MintableERC721 module.
 * @param params - The parameters for the module.
 * @returns - The encoded data.
 * @modules MintableERC721
 */
export function encodeInstall(params: EncodeBytesOnInstallParams) {
  return encodeBytesOnInstallParams(params);
}
