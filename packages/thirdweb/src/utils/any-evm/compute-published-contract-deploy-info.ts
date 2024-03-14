import type { AbiConstructor } from "abitype";
import type { ThirdwebClient } from "../../client/client.js";
import { getInitBytecodeWithSalt } from "./get-init-bytecode-with-salt.js";
import {
  fetchDeployMetadata,
  type PreDeployMetadata,
} from "./deploy-metadata.js";
import { fetchPublishedContract } from "./fetch-published-contract.js";
import type { Chain } from "../../chains/types.js";
import { encodeAbiParameters } from "../abi/encodeAbiParameters.js";
import { getCreate2FactoryAddress } from "../../contract/deployment/utils/create-2-factory.js";

/**
 * @internal
 */
export async function computeDeploymentInfoFromContractId(args: {
  client: ThirdwebClient;
  chain: Chain;
  contractId: string;
  constructorParams: unknown[];
}) {
  const { client, chain, contractId, constructorParams } = args;
  const contractModel = await fetchPublishedContract({
    client,
    contractId,
  });
  const { compilerMetadata } = await fetchDeployMetadata({
    client,
    uri: contractModel.publishMetadataUri,
  });
  return computeDeploymentInfoFromMetadata({
    client,
    chain,
    compilerMetadata,
    constructorParams,
  });
}

/**
 * @internal
 */
export async function computeDeploymentInfoFromMetadata(args: {
  client: ThirdwebClient;
  chain: Chain;
  compilerMetadata: PreDeployMetadata;
  constructorParams: unknown[];
}) {
  const { client, chain, compilerMetadata, constructorParams } = args;
  const create2FactoryAddress = await getCreate2FactoryAddress({
    client,
    chain,
  });
  if (!create2FactoryAddress) {
    throw new Error(
      `Create2Factory not found for chain ${chain.id} - please deploy it first`,
    );
  }
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
  return {
    bytecode,
    initBytecodeWithsalt,
    encodedArgs,
    create2FactoryAddress,
  };
}
