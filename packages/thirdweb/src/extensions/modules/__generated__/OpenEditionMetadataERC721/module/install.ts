import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import type { PreparedTransaction } from "../../../../../transaction/prepare-transaction.js";
import type { Address } from "../../../../../utils/address.js";
import type { Account } from "../../../../../wallets/interfaces/wallet.js";

import { getOrDeployModule } from "../../../common/getOrDeployModule.js";
import { installPublishedModule } from "../../../common/installPublishedModule.js";

const contractId = "OpenEditionMetadataERC721";

/**
 * Convenience function to add the OpenEditionMetadataERC721 module as a default module on a core contract.
 * @param params - The parameters for the module.
 * @returns - The module function.
 * @example
 * ```ts
 * import { OpenEditionMetadataERC721, deployModularContract } from "thirdweb/modules";
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
 *     OpenEditionMetadataERC721.module(),
 *   ],
 * });
 * ```
 * @module OpenEditionMetadataERC721
 */
export function module(params?: { publisher?: string }) {
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
      module: moduleContract.address as Address,
      data: "0x" as const,
    };
  };
}

/**
 * Installs the OpenEditionMetadataERC721 module on a core contract.
 * @param options
 * @returns the transaction to install the module
 * @example
 * ```ts
 * import { OpenEditionMetadataERC721 } from "thirdweb/modules";
 *
 * const transaction  = OpenEditionMetadataERC721.install({
 *  contract: coreContract,
 *  account: account,
 
 * });
 *
 * await sendTransaction({
 *  transaction,
 *  account,
 * });
 * ```
 * @module OpenEditionMetadataERC721
 */
export function install(options: {
  contract: ThirdwebContract;
  account: Account;
  params?: { publisher?: string };
}): PreparedTransaction {
  return installPublishedModule({
    account: options.account,
    contract: options.contract,
    moduleName: contractId,
    moduleData: "0x" as const,
    publisher: options.params?.publisher,
  });
}

/**
 * Encodes the install data for the OpenEditionMetadataERC721 module.
 * @param params - The parameters for the module.
 * @returns - The encoded data.
 * @module OpenEditionMetadataERC721
 */
export const encodeInstall = () => "0x";
