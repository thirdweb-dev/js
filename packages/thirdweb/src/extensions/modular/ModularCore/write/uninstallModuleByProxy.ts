import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import { resolveImplementation } from "../../../../utils/bytecode/resolveImplementation.js";
import { uninstallModule } from "../../__generated__/ModularCore/write/uninstallModule.js";

/**
 * @extension MODULAR
 */
export type UninstallModuleByProxyOptions = {
  client: ThirdwebClient;
  chain: Chain;
  contract: ThirdwebContract;
  moduleProxyAddress: string;
  moduleData?: `0x${string}`;
};

/**
 * Uninstall a module by proxy
 * @param options - The options for uninstalling a module by proxy
 * @returns A prepared transaction to send
 * @extension MODULAR
 * @example
 * ```ts
 * import { uninstallModuleByProxy } from "thirdweb/modules/modular";
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
        module: moduleImplementation.address,
        data: moduleData || "0x",
      };
    },
  });
}
