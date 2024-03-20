import type { Prettify } from "../../utils/type-utils.js";
import type { SharedDeployOptions } from "./types.js";
import type { FetchDeployMetadataResult } from "../../utils/any-evm/deploy-metadata.js";
import type { AbiConstructor } from "abitype";
import { prepareDirectDeployTransaction } from "./deploy-with-abi.js";
import { ensureBytecodePrefix } from "../../utils/bytecode/prefix.js";
import { isHex } from "../../utils/encoding/hex.js";
import { prepareAutoFactoryDeployTransaction } from "./deploy-via-autofactory.js";
import type { ThirdwebContract } from "../contract.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";

export type PrepareDeployTransactionFromMetadataOptions = Prettify<
  {
    contractMetadata: FetchDeployMetadataResult;
    constructorParams: unknown[];
    cloneFactoryContract?: ThirdwebContract;
  } & SharedDeployOptions
>;

/**
 * Prepares a deploy transaction from a URI.
 * @param options - The options for deploying the contract.
 * @returns A promise that resolves to the deployment transaction.
 * @throws An error if deployments are disabled on the network or if the contract bytecode is invalid.
 * @example
 * ```ts
 * import { prepareDeployTransactionFromMetadata } from "thirdweb/contract";
 * import { ethereum } from "thirdweb/chains";
 * const tx = await prepareDeployTransactionFromMetadata({
 *  client,
 *  contractMetadata,
 *  constuctorParams: [123, "hello"],
 * });
 * ```
 */
export function prepareDeployTransactionFromMetadata(
  options: PrepareDeployTransactionFromMetadataOptions,
): PreparedTransaction {
  const { compilerMetadata, extendedMetadata } = options.contractMetadata;

  const forceDirectDeploy = options.forceDirectDeploy ?? false;
  const chainId = options.chain.id;
  const isNetworkEnabled = !!(
    extendedMetadata?.networksForDeployment?.networksEnabled?.includes(
      chainId,
    ) || extendedMetadata?.networksForDeployment?.allNetworks
  );

  if (
    extendedMetadata?.networksForDeployment &&
    !isNetworkEnabled &&
    compilerMetadata.name !== "AccountFactory" // ignore network restrictions for simple AccountFactory
  ) {
    throw new Error(
      `Deployments disabled on this network, with chainId: ${chainId}`,
    );
  }

  if (
    extendedMetadata &&
    extendedMetadata.factoryDeploymentData &&
    (extendedMetadata.isDeployableViaProxy ||
      extendedMetadata.isDeployableViaFactory ||
      (extendedMetadata.deployType &&
        extendedMetadata.deployType !== "standard")) &&
    !forceDirectDeploy
  ) {
    if (extendedMetadata.deployType === "autoFactory") {
      if (!options.cloneFactoryContract) {
        throw new Error(
          "A cloneFactoryContract is required for autoFactory deployments.",
        );
      }
      return prepareAutoFactoryDeployTransaction({
        chain: options.chain,
        client: options.client,
        contractMetadata: options.contractMetadata,
        initializerArgs: options.constructorParams,
        cloneFactoryContract: options.cloneFactoryContract,
      });
    }
    // TODO: support factory and proxy deployments
    throw new Error(
      "Contract is not deployable directly. Use a factory or proxy deployment.",
    );
  }

  const bytecode = ensureBytecodePrefix(compilerMetadata.bytecode);
  if (!isHex(bytecode)) {
    throw new Error(`Contract bytecode is invalid.\n\n${bytecode}`);
  }

  const constructorAbi =
    (compilerMetadata.abi.find(
      (abi) => abi.type === "constructor",
    ) as AbiConstructor) || [];

  return prepareDirectDeployTransaction({
    bytecode,
    chain: options.chain,
    client: options.client,
    constructorAbi,
    constructorParams: options.constructorParams,
  });
}
