import { getContract, type ThirdwebContract } from "../../../../contract/contract.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Chain } from "../../../../chains/types.js";
import { uninstallExtension } from "../../__generated__/ModularCoreUpgradeable/write/uninstallExtension.js";
import { resolveImplementation } from "../../../../utils/bytecode/resolveImplementation.js";

export type UninstallExtensionByProxyOptions = {
  client: ThirdwebClient;
  chain: Chain;
  contract: ThirdwebContract;
  extensionProxyAddress: string;
  extensionData?: `0x${string}`;
};

export function uninstallExtensionByProxy(
  options: UninstallExtensionByProxyOptions,
) {
  const {
    client,
    chain,
    contract,
    extensionProxyAddress,
    extensionData,
  } = options;

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
        extensionImplementation: extensionImplementation.address,
        data: extensionData || "0x",
      }
    }
  });
}
