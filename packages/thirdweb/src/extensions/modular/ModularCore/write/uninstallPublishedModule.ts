import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { ThirdwebContract } from "../../../../contract/contract.js";
import { getDeployedInfraContract } from "../../../../contract/deployment/utils/infra.js";
import { uninstallModule } from "../../__generated__/ModularCore/write/uninstallModule.js";

/**
 * @extension MODULAR
 */
export type UninstallPublishedModuleOptions = {
  client: ThirdwebClient;
  chain: Chain;
  contract: ThirdwebContract;
  moduleName: string;
  publisherAddress?: string;
  version?: string;
  constructorParams?: unknown[];
  moduleData?: `0x${string}`;
};

/**
 * Uninstall a published module
 * @param options - The options for uninstalling a published module
 * @returns A prepared transaction to send
 * @extension MODULAR
 * @example
 * ```ts
 * import { uninstallPublishedModule } from "thirdweb/modules/modular";
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
  const {
    client,
    chain,
    contract,
    moduleName,
    publisherAddress,
    constructorParams,
    moduleData,
  } = options;

  return uninstallModule({
    contract,
    asyncParams: async () => {
      const deployedModule = await getDeployedInfraContract({
        chain,
        client,
        contractId: moduleName,
        constructorParams: constructorParams || [],
        publisher: publisherAddress,
      });
      return {
        module: deployedModule?.address as string,
        data: moduleData || "0x",
      };
    },
  });
}
