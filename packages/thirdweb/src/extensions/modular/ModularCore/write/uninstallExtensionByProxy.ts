import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import { resolveImplementation } from "../../../../utils/bytecode/resolveImplementation.js";
import { uninstallExtension } from "../../__generated__/ModularCore/write/uninstallExtension.js";

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
