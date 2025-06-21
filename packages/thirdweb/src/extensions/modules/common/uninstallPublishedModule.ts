import type { ThirdwebContract } from "../../../contract/contract.js";
import { getDeployedInfraContract } from "../../../contract/deployment/utils/infra.js";
import { uninstallModule } from "../__generated__/IModularCore/write/uninstallModule.js";

/**
 * @modules
 */
export type UninstallPublishedModuleOptions = {
  contract: ThirdwebContract;
  moduleName: string;
  publisherAddress?: string;
  version?: string;
  moduleData?: `0x${string}`;
};

/**
 * Uninstall a published module
 * @param options - The options for uninstalling a published module
 * @returns A prepared transaction to send
 * @modules
 * @example
 * ```ts
 * import { uninstallPublishedModule } from "thirdweb/modules";
 * const transaction = uninstallPublishedModule({
 *  client,
 *  chain,
 *  contract,
 *  moduleName: "MyModule",
 *  publisherAddress: "0x...",
 * });
 * await sendTransaction({ transaction, account });
 * ```
 */
export function uninstallPublishedModule(
  options: UninstallPublishedModuleOptions,
) {
  const { contract, moduleName, publisherAddress, moduleData } = options;

  return uninstallModule({
    asyncParams: async () => {
      const deployedModule = await getDeployedInfraContract({
        chain: contract.chain,
        client: contract.client,
        contractId: moduleName,
        publisher: publisherAddress,
      });
      return {
        data: moduleData || "0x",
        moduleContract: deployedModule?.address as string,
      };
    },
    contract,
  });
}
