import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { ThirdwebContract } from "../../../../contract/contract.js";
import { getOrDeployInfraForPublishedContract } from "../../../../contract/deployment/utils/bootstrap.js";
import type { Account } from "../../../../wallets/interfaces/wallet.js";
import { installModule } from "../../__generated__/ModularCore/write/installModule.js";

/**
 * @extension MODULAR
 */
export type InstallPublishedModuleOptions = {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
  contract: ThirdwebContract;
  moduleName: string;
  publisherAddress?: string;
  version?: string;
  constructorParams?: unknown[];
  moduleData?: `0x${string}`;
};

/**
 * Install a published module on a modular contract
 * @param options - The options for installing a published module
 * @returns A prepared transaction to send
 * @extension MODULAR
 * @example
 * ```ts
 * import { installPublishedModule } from "thirdweb/modules/modular";
 * const transaction = installPublishedModule({
 *  client,
 *  chain,
 *  account,
 *  contract,
 *  moduleName: "MyModule",
 *  publisherAddress: "0x...",
 * });
 * await sendTransaction({ transaction, account });
 * ```
 */
export function installPublishedModule(options: InstallPublishedModuleOptions) {
  const {
    client,
    chain,
    account,
    contract,
    moduleName,
    constructorParams,
    publisherAddress,
    moduleData,
  } = options;

  return installModule({
    contract,
    asyncParams: async () => {
      const deployedModule = await getOrDeployInfraForPublishedContract({
        chain,
        client,
        account,
        contractId: moduleName,
        constructorParams: constructorParams || [],
        publisher: publisherAddress,
      });
      return {
        module: deployedModule.implementationContract.address as string,
        data: moduleData || "0x",
      };
    },
  });
}
