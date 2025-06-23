import type { ThirdwebContract } from "../../../contract/contract.js";
import { getOrDeployInfraForPublishedContract } from "../../../contract/deployment/utils/bootstrap.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { installModule } from "../__generated__/IModularCore/write/installModule.js";

/**
 * @modules
 */
export type InstallPublishedModuleOptions = {
  account: Account;
  contract: ThirdwebContract;
  moduleName: string;
  publisher?: string;
  version?: string;
  constructorParams?: Record<string, unknown>;
  moduleData?: `0x${string}`;
  nonce?: number;
};

/**
 * Install a published module on a modular contract
 * @param options - The options for installing a published module
 * @returns A prepared transaction to send
 * @modules
 * @example
 * ```ts
 * import { installPublishedModule } from "thirdweb/modules";
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
    account,
    contract,
    moduleName,
    constructorParams,
    publisher,
    moduleData,
    nonce,
  } = options;

  return installModule({
    asyncParams: async () => {
      const deployedModule = await getOrDeployInfraForPublishedContract({
        account,
        chain: contract.chain,
        client: contract.client,
        constructorParams,
        contractId: moduleName,
        publisher,
      });
      return {
        data: moduleData || "0x",
        moduleContract: deployedModule.implementationContract.address as string,
      };
    },
    contract,
    overrides: {
      nonce,
    },
  });
}
