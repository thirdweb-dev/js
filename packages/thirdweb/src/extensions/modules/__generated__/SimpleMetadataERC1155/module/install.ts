import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import type { PreparedTransaction } from "../../../../../transaction/prepare-transaction.js";
import type { Address } from "../../../../../utils/address.js";
import type { Account } from "../../../../../wallets/interfaces/wallet.js";

import { getOrDeployModule } from "../../../common/getOrDeployModule.js";
import { installPublishedModule } from "../../../common/installPublishedModule.js";

const contractId = "SimpleMetadataERC1155";

/**
 * Convenience function to add the SimpleMetadataERC1155 module as a default module on a core contract.
 * @param params - The parameters for the module.
 * @returns - The module function.
 * @example
 * ```ts
 * import { SimpleMetadataERC1155, deployModularContract } from "thirdweb/modules";
 *
 * const deployed = deployModularContract({
 *   contract,
 *   account,
 *   params: {
 *     name: "My Modular Contract",
 *   },
 *   modules: [
 *     SimpleMetadataERC1155.module(),
 *   ],
 * });
 * ```
 * @module SimpleMetadataERC1155
 */
export function module() {
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
    });
    return {
      module: moduleContract.address as Address,
      data: "0x" as const,
    };
  };
}

/**
 * Installs the SimpleMetadataERC1155 module on a core contract.
 * @param options
 * @returns the transaction to install the module
 * @example
 * ```ts
 * import { SimpleMetadataERC1155 } from "thirdweb/modules";
 *
 * const transaction  = SimpleMetadataERC1155.install({
 *  contract: coreContract,
 *  account: account,
 
 * });
 *
 * await sendTransaction({
 *  transaction,
 *  account,
 * });
 * ```
 * @module SimpleMetadataERC1155
 */
export function install(options: {
  contract: ThirdwebContract;
  account: Account;
}): PreparedTransaction {
  return installPublishedModule({
    account: options.account,
    contract: options.contract,
    moduleName: contractId,
    moduleData: "0x" as const,
  });
}

/**
 * Encodes the install data for the SimpleMetadataERC1155 module.
 * @param params - The parameters for the module.
 * @returns - The encoded data.
 * @module SimpleMetadataERC1155
 */
export const encodeInstall = () => "0x";
