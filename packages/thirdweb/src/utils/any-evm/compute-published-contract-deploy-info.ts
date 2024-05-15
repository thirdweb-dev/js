import type { AbiConstructor } from "abitype";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { fetchPublishedContractMetadata } from "../../contract/deployment/publisher.js";
import { computeCreate2FactoryAddress } from "../../contract/deployment/utils/create-2-factory.js";
import { encodeAbiParameters } from "../abi/encodeAbiParameters.js";
import type { FetchDeployMetadataResult } from "./deploy-metadata.js";
import { getInitBytecodeWithSalt } from "./get-init-bytecode-with-salt.js";

/**
 * @internal
 */
export async function computeDeploymentInfoFromContractId(args: {
  client: ThirdwebClient;
  chain: Chain;
  contractId: string;
  constructorParams: unknown[];
  publisher?: string;
  version?: string;
  salt?: string;
}) {
  const { client, chain, contractId, constructorParams, salt } = args;
  const contractMetadata = await fetchPublishedContractMetadata({
    client,
    contractId,
    publisher: args.publisher,
  });
  return computeDeploymentInfoFromMetadata({
    client,
    chain,
    contractMetadata,
    constructorParams,
    salt,
  });
}

/**
 * @internal
 */
export async function computeDeploymentInfoFromMetadata(args: {
  client: ThirdwebClient;
  chain: Chain;
  contractMetadata: FetchDeployMetadataResult;
  constructorParams: unknown[];
  salt?: string;
}) {
  const { client, chain, contractMetadata, constructorParams, salt } = args;
  const { compilerMetadata } = contractMetadata;
  const create2FactoryAddress = await computeCreate2FactoryAddress({
    client,
    chain,
  });
  const bytecode = compilerMetadata.bytecode;
  const constructorAbi =
    (compilerMetadata.abi.find(
      (abi) => abi.type === "constructor",
    ) as AbiConstructor) || [];
  const encodedArgs = encodeAbiParameters(
    constructorAbi.inputs ?? [],
    constructorParams,
  );
  const initBytecodeWithsalt = getInitBytecodeWithSalt({
    bytecode,
    encodedArgs,
    salt,
  });
  return {
    bytecode,
    initBytecodeWithsalt,
    encodedArgs,
    create2FactoryAddress,
  };
}
