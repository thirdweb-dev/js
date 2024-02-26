import type { AbiConstructor } from "abitype";
import type { ThirdwebClient } from "../../../client/client.js";
import { getInitBytecodeWithSalt } from "../../../utils/any-evm/get-init-bytecode-with-salt.js";
import { fetchDeployMetadata } from "./deploy-metadata.js";
import { fetchPublishedContract } from "./fetch-published-contract.js";
import { computeDeploymentAddress } from "../../../utils/any-evm/compute-deployment-address.js";
import { getCreate2FactoryAddress } from "../../../utils/any-evm/create-2-factory.js";
import type { Chain } from "../../../chains/types.js";
import { encodeAbiParameters } from "../../../utils/abi/encodeAbiParameters.js";

/**
 * Predicts the implementation address of any published contract
 * @param args - The arguments for predicting the address of a published contract.
 * @param args.client - The Thirdweb client.
 * @param args.chain - The chain to predict the address on.
 * @param args.contractId - The ID of the contract to predict the address of.
 * @param args.constructorParams - The parameters for the contract constructor.
 * @example
 * ```ts
 * import { predictPublishedContractAddress } from "thirdweb/contract";
 *
 * const address = await predictPublishedContractAddress({
 *   client,
 *   chain,
 *   contractId,
 *   constructorParams,
 * });
 * ```
 * @returns A promise that resolves to the predicted address of the contract.
 */
export async function predictPublishedContractAddress(args: {
  client: ThirdwebClient;
  chain: Chain;
  contractId: string;
  constructorParams: unknown[]; // TODO automate contract params from known inputs
}): Promise<string> {
  const { client, chain, contractId, constructorParams } = args;
  const contractModel = await fetchPublishedContract({
    client,
    contractId,
  });
  const [{ compilerMetadata }, create2FactoryAddress] = await Promise.all([
    fetchDeployMetadata({
      client,
      uri: contractModel.publishMetadataUri,
    }),
    getCreate2FactoryAddress({
      client,
      chain,
    }),
  ]);
  const bytecode = compilerMetadata.bytecode;
  const constructorAbi =
    (compilerMetadata.abi.find(
      (abi) => abi.type === "constructor",
    ) as AbiConstructor) || [];
  const encodedArgs = encodeAbiParameters(
    constructorAbi.inputs,
    constructorParams,
  );
  const initBytecodeWithsalt = getInitBytecodeWithSalt({
    bytecode,
    encodedArgs,
  });
  return computeDeploymentAddress({
    bytecode,
    encodedArgs,
    create2FactoryAddress,
    salt: initBytecodeWithsalt,
  });
}
