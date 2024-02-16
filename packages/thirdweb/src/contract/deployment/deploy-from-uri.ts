import { isHex } from "viem";
import { getChainIdFromChain } from "../../chain/index.js";
import { ensureBytecodePrefix } from "../../utils/index.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { SharedDeployOptions } from "./types.js";
import { fetchDeployMetadata } from "./utils/deploy-metadata.js";
import type { AbiConstructor } from "abitype";
import { prepareDirectDeployTransaction } from "./deploy-with-abi.js";

export type PrepareDeployTransactionFromUriOptions = Prettify<
  {
    uri: string;
  } & SharedDeployOptions
>;

/**
 * Prepares a deploy transaction from a URI.
 * @param options - The options for deploying the contract.
 * @returns A promise that resolves to the deployment transaction.
 * @throws An error if deployments are disabled on the network or if the contract bytecode is invalid.
 * @example
 * ```ts
 * const tx = await prepareDeployTransactionFromUri({
 *  client,
 *  uri: "ipfs://Qm...",
 *  constuctorParams: [123, "hello"],
 *  chain: 1,
 * });
 * ```
 */
export async function prepareDeployTransactionFromUri(
  options: PrepareDeployTransactionFromUriOptions,
) {
  const { compilerMetadata, extendedMetadata } = await fetchDeployMetadata({
    client: options.client,
    uri: options.uri,
  });

  const forceDirectDeploy = options.forceDirectDeploy ?? false;
  const chainId = getChainIdFromChain(options.chain);
  const isNetworkEnabled = !!(
    extendedMetadata?.networksForDeployment?.networksEnabled?.includes(
      // TODO: align with chainId being bigint
      Number(chainId),
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
    // TODO: support factory and proxy deployments
    throw new Error(
      "Contract is not deployable directly. Use a factory or proxy deployment.",
    );
  }

  const bytecode = ensureBytecodePrefix(compilerMetadata.bytecode);
  if (!isHex(bytecode)) {
    throw new Error(`Contract bytecode is invalid.\n\n${bytecode}`);
  }

  const constructorAbi = compilerMetadata.abi.find(
    (abi) => abi.type === "constructor",
  ) as AbiConstructor;
  if (!constructorAbi) {
    throw new Error("No constructor found in the contract ABI");
  }

  return prepareDirectDeployTransaction({
    bytecode,
    chain: options.chain,
    client: options.client,
    constructorAbi,
    constructorParams: options.constructorParams,
  });
}
