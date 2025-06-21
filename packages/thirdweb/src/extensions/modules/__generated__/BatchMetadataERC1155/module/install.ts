import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import type { PreparedTransaction } from "../../../../../transaction/prepare-transaction.js";
import type { Address } from "../../../../../utils/address.js";
import type { Account } from "../../../../../wallets/interfaces/wallet.js";

import { getOrDeployModule } from "../../../common/getOrDeployModule.js";
import { installPublishedModule } from "../../../common/installPublishedModule.js";

const contractId = "BatchMetadataERC1155";

/**
 * Convenience function to add the BatchMetadataERC1155 module as a default module on a core contract.
 * @param params - The parameters for the module.
 * @returns - The module function.
 * @example
 * ```ts
 * import { BatchMetadataERC1155, deployModularContract } from "thirdweb/modules";
 *
 * const deployed = deployModularContract({
 *   client,
 *   chain,
 *   account,
 *   core: "ERC1155",
 *   params: {
 *     name: "My Modular Contract",
 *   },
 *   modules: [
 *     BatchMetadataERC1155.module(),
 *   ],
 * });
 * ```
 * @modules BatchMetadataERC1155
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
      data: "0x" as const,
      module: moduleContract.address as Address,
    };
  };
}

/**
 * Installs the BatchMetadataERC1155 module on a core contract.
 * @param options
 * @returns the transaction to install the module
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 *
 * const transaction  = BatchMetadataERC1155.install({
 *  contract: coreContract,
 *  account: account,
 
 * });
 *
 * await sendTransaction({
 *  transaction,
 *  account,
 * });
 * ```
 * @modules BatchMetadataERC1155
 */
export function install(options: {
  contract: ThirdwebContract;
  account: Account;
  params?: { publisher?: string };
}): PreparedTransaction {
  return installPublishedModule({
    account: options.account,
    contract: options.contract,
    moduleData: "0x" as const,
    moduleName: contractId,
    publisher: options.params?.publisher,
  });
}

/**
 * Encodes the install data for the BatchMetadataERC1155 module.
 * @param params - The parameters for the module.
 * @returns - The encoded data.
 * @modules BatchMetadataERC1155
 */
export function encodeInstall() {
  return "0x";
}
