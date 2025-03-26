import { resolveContractAbi } from "../../../contract/actions/resolve-abi.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { getOrDeployInfraForPublishedContract } from "../../../contract/deployment/utils/bootstrap.js";
import {
  generateExtensionFunctionsFromAbi,
  getAllDefaultConstructorParamsForImplementation,
} from "../../../extensions/prebuilts/get-required-transactions.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { addExtension } from "../__generated__/IExtensionManager/write/addExtension.js";

export type InstallPublishedExtensionOptions = {
  account: Account;
  contract: ThirdwebContract;
  extensionName: string;
  publisher?: string;
  version?: string;
  constructorParams?: Record<string, unknown>;
};

/**
 * Install a published extension on a dynamic contract
 * @param options - The options for installing a published extension
 * @returns A prepared transaction to send
 * @example
 * ```ts
 * import { installPublishedExtension } from "thirdweb/dynamic-contracts";
 * const transaction = installPublishedExtension({
 *  client,
 *  chain,
 *  account,
 *  contract,
 *  extensionName: "MyExtension",
 *  publisherAddress: "0x...",
 * });
 * await sendTransaction({ transaction, account });
 * ```
 */
export function installPublishedExtension(
  options: InstallPublishedExtensionOptions,
) {
  const {
    account,
    contract,
    extensionName,
    constructorParams,
    publisher,
    version,
  } = options;

  return addExtension({
    contract,
    asyncParams: async () => {
      const deployedExtension = await getOrDeployInfraForPublishedContract({
        chain: contract.chain,
        client: contract.client,
        account,
        contractId: extensionName,
        constructorParams:
          constructorParams ||
          (await getAllDefaultConstructorParamsForImplementation({
            chain: contract.chain,
            client: contract.client,
            contractId: extensionName,
          })),
        publisher,
        version,
      });

      const abi = await resolveContractAbi(
        deployedExtension.implementationContract,
      );
      const functions = generateExtensionFunctionsFromAbi(abi);
      return {
        extension: {
          metadata: {
            name: extensionName,
            metadataURI: "",
            implementation: deployedExtension.implementationContract.address,
          },
          functions,
        },
      };
    },
  });
}
