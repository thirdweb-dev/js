import type { AbiConstructor } from "abitype";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import { deployContract } from "../../contract/deployment/deploy-with-abi.js";
import { fetchPublishedContractMetadata } from "../../contract/deployment/publisher.js";
import { getOrDeployInfraForPublishedContract } from "../../contract/deployment/utils/bootstrap.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { simulateTransaction } from "../../transaction/actions/simulate.js";
import { prepareContractCall } from "../../transaction/prepare-contract-call.js";
import { resolveMethod } from "../../transaction/resolve-method.js";
import type { Account } from "../../wallets/interfaces/wallet.js";

export type DeployPublishedContractOptions = {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
  contractId: string;
  contractParams: unknown[];
  publisher?: string;
  version?: string;
  implementationConstructorParams?: unknown[];
};

/**
 * Deploy an instance of a published contract on a given chain
 * @param options - the deploy options
 * @returns a promise that resolves to the deployed contract address
 * @example
 * ```
 * import { deployPublishedContract } from "thirdweb/deploys";
 *
 * const address = await deployedPublishedContract({
 *   client,
 *   chain,
 *   account,
 *   contractId: "MyPublishedContract",
 *   contractParams: [...],
 *   publisher: "0x...",
 * });
 * ```
 * @extension DEPLOY
 */
export async function deployPublishedContract(
  options: DeployPublishedContractOptions,
): Promise<string> {
  const {
    client,
    account,
    chain,
    contractId,
    contractParams,
    publisher,
    version,
    implementationConstructorParams,
  } = options;
  const { compilerMetadata, extendedMetadata } =
    await fetchPublishedContractMetadata({
      client,
      contractId,
      publisher,
      version,
    });
  if (extendedMetadata?.deployType === "standard") {
    return deployContract({
      account,
      client,
      chain,
      bytecode: compilerMetadata.bytecode,
      constructorAbi:
        (compilerMetadata.abi.find(
          (i) => i.type === "constructor",
        ) as AbiConstructor) || [],
      constructorParams: contractParams,
    });
  }

  if (extendedMetadata?.deployType === "autoFactory") {
    const { cloneFactoryContract, implementationContract } =
      await getOrDeployInfraForPublishedContract({
        chain,
        client,
        account,
        contractId,
        constructorParams: implementationConstructorParams || [],
      });
    const initializeTransaction = prepareContractCall({
      contract: getContract({
        client,
        chain,
        address: implementationContract.address,
      }),
      method: resolveMethod(
        extendedMetadata.factoryDeploymentData
          ?.implementationInitializerFunction || "initialize",
      ),
      params: contractParams,
    });

    return deployViaAutoFactory({
      client,
      chain,
      account,
      cloneFactoryContract,
      initializeTransaction,
    });
  }

  if (extendedMetadata?.deployType === "customFactory") {
    if (!extendedMetadata?.factoryDeploymentData?.customFactoryInput) {
      throw new Error("No custom factory info found");
    }
    const factoryAddress =
      extendedMetadata?.factoryDeploymentData?.customFactoryInput
        ?.customFactoryAddresses?.[chain.id];
    const factoryFunction =
      extendedMetadata.factoryDeploymentData?.customFactoryInput
        ?.factoryFunction;
    if (!factoryAddress || !factoryFunction) {
      throw new Error(`No factory address found on chain ${chain.id}`);
    }

    const factory = getContract({
      client,
      chain,
      address: factoryAddress,
    });
    const deployTx = prepareContractCall({
      contract: factory,
      method: resolveMethod(factoryFunction),
      params: contractParams,
    });
    // asumption here is that the factory address returns the deployed proxy address
    const address = simulateTransaction({
      transaction: deployTx,
    });
    await sendAndConfirmTransaction({
      transaction: deployTx,
      account,
    });
    return address;
  }

  throw new Error(`Unsupported deploy type: ${extendedMetadata?.deployType}`);
}
