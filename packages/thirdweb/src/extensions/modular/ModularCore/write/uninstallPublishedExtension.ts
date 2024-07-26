import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { ThirdwebContract } from "../../../../contract/contract.js";
import { getDeployedInfraContract } from "../../../../contract/deployment/utils/infra.js";
import { uninstallExtension } from "../../__generated__/ModularCore/write/uninstallExtension.js";

/**
 * @extension MODULAR
 */
export type UninstallPublishedExtensionOptions = {
  client: ThirdwebClient;
  chain: Chain;
  contract: ThirdwebContract;
  extensionName: string;
  publisherAddress?: string;
  version?: string;
  constructorParams?: unknown[];
  extensionData?: `0x${string}`;
};

/**
 * Uninstall a published extension
 * @param options - The options for uninstalling a published extension
 * @returns A prepared transaction to send
 * @extension MODULAR
 * @example
 * ```ts
 * import { uninstallPublishedExtension } from "thirdweb/extensions/modular";
 * const transaction = uninstallPublishedExtension({
 *  client,
 *  chain,
 *  contract,
 *  extensionName: "MyExtension",
 *  publisherAddress: "0x...",
 * });
 * await sendTransaction({ transaction, account });
 * ```
 */
export function uninstallPublishedExtension(
  options: UninstallPublishedExtensionOptions,
) {
  const {
    client,
    chain,
    contract,
    extensionName,
    publisherAddress,
    constructorParams,
    extensionData,
  } = options;

  return uninstallExtension({
    contract,
    asyncParams: async () => {
      const deployedExtension = await getDeployedInfraContract({
        chain,
        client,
        contractId: extensionName,
        constructorParams: constructorParams || [],
        publisher: publisherAddress,
      });
      return {
        extension: deployedExtension?.address as string,
        data: extensionData || "0x",
      };
    },
  });
}
