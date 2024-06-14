import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { ThirdwebContract } from "../../../../contract/contract.js";
import { getOrDeployInfraForPublishedContract } from "../../../../contract/deployment/utils/bootstrap.js";
import type { Account } from "../../../../wallets/interfaces/wallet.js";
import { installExtension } from "../../__generated__/ModularCore/write/installExtension.js";

export type InstallPublishedExtensionOptions = {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
  contract: ThirdwebContract;
  extensionName: string;
  publisherAddress: string;
  version?: string;
  constructorParams?: unknown[];
  extensionData?: `0x${string}`;
};

export function installPublishedExtension(
  options: InstallPublishedExtensionOptions,
) {
  const {
    client,
    chain,
    account,
    contract,
    extensionName,
    constructorParams,
    publisherAddress,
    extensionData,
  } = options;

  return installExtension({
    contract,
    asyncParams: async () => {
      const deployedExtension = await getOrDeployInfraForPublishedContract({
        chain,
        client,
        account,
        contractId: extensionName,
        constructorParams: constructorParams || [],
        publisher: publisherAddress,
      });
      return {
        extension: deployedExtension.implementationContract.address as string,
        data: extensionData || "0x",
      };
    },
  });
}
