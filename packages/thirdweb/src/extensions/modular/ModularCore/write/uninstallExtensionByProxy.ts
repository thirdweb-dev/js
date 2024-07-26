import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import { resolveImplementation } from "../../../../utils/bytecode/resolveImplementation.js";
import { uninstallExtension } from "../../__generated__/ModularCore/write/uninstallExtension.js";

/**
 * @extension MODULAR
 */
export type UninstallExtensionByProxyOptions = {
  client: ThirdwebClient;
  chain: Chain;
  contract: ThirdwebContract;
  extensionProxyAddress: string;
  extensionData?: `0x${string}`;
};

/**
 * Uninstall an extension by proxy
 * @param options - The options for uninstalling an extension by proxy
 * @returns A prepared transaction to send
 * @extension MODULAR
 * @example
 * ```ts
 * import { uninstallExtensionByProxy } from "thirdweb/extensions/modular";
 * const transaction = uninstallExtensionByProxy({
 *  client,
 *  chain,
 *  contract,
 *  extensionProxyAddress: "0x...",
 * });
 * await sendTransaction({ transaction, account });
 * ```
 */
export function uninstallExtensionByProxy(
  options: UninstallExtensionByProxyOptions,
) {
  const { client, chain, contract, extensionProxyAddress, extensionData } =
    options;

  return uninstallExtension({
    contract,
    asyncParams: async () => {
      const extensionImplementation = await resolveImplementation(
        getContract({
          chain,
          client,
          address: extensionProxyAddress,
        }),
      );
      return {
        extension: extensionImplementation.address,
        data: extensionData || "0x",
      };
    },
  });
}
