import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { resolveImplementation } from "../../../utils/bytecode/resolveImplementation.js";
import { uninstallModule } from "../__generated__/IModularCore/write/uninstallModule.js";

/**
 * @modules
 */
export type UninstallModuleByProxyOptions = {
  client: ThirdwebClient;
  chain: Chain;
  contract: ThirdwebContract;
  moduleProxyAddress: string;
  moduleData?: `0x${string}`;
};

/**
 * Uninstall an module by proxy
 * @param options - The options for uninstalling an module by proxy
 * @returns A prepared transaction to send
 * @modules
 * @example
 * ```ts
 * import { uninstallModuleByProxy } from "thirdweb/modules";
 * const transaction = uninstallModuleByProxy({
 *  client,
 *  chain,
 *  contract,
 *  moduleProxyAddress: "0x...",
 * });
 * await sendTransaction({ transaction, account });
 * ```
 */
export function uninstallModuleByProxy(options: UninstallModuleByProxyOptions) {
  const { client, chain, contract, moduleProxyAddress, moduleData } = options;

  return uninstallModule({
    contract,
    asyncParams: async () => {
      const moduleImplementation = await resolveImplementation(
        getContract({
          chain,
          client,
          address: moduleProxyAddress,
        }),
      );
      return {
        moduleContract: moduleImplementation.address,
        data: moduleData || "0x",
      };
    },
  });
}
