import type { Abi, AbiConstructor } from "abitype";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { fetchPublishedContractMetadata } from "../../contract/deployment/publisher.js";
import { computeCreate2FactoryAddress } from "../../contract/deployment/utils/create-2-factory.js";
import { encodeAbiParameters } from "../abi/encodeAbiParameters.js";
import { normalizeFunctionParams } from "../abi/normalizeFunctionParams.js";
import { ensureBytecodePrefix } from "../bytecode/prefix.js";
import type { Hex } from "../encoding/hex.js";
import {
  type FetchDeployMetadataResult,
  fetchBytecodeFromCompilerMetadata,
} from "./deploy-metadata.js";
import { getInitBytecodeWithSalt } from "./get-init-bytecode-with-salt.js";

/**
 * @internal
 */
export async function computeDeploymentInfoFromContractId(args: {
  client: ThirdwebClient;
  chain: Chain;
  contractId: string;
  constructorParams?: Record<string, unknown>;
  publisher?: string;
  version?: string;
  salt?: string;
}) {
  const { client, chain, contractId, constructorParams, salt } = args;
  const contractMetadata = await fetchPublishedContractMetadata({
    client,
    contractId,
    publisher: args.publisher,
    version: args.version,
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
  constructorParams?: Record<string, unknown>;
  salt?: string;
}) {
  return computeDeploymentInfoFromBytecode({
    client: args.client,
    chain: args.chain,
    abi: args.contractMetadata.abi,
    bytecode: await fetchBytecodeFromCompilerMetadata({
      compilerMetadata: args.contractMetadata,
      client: args.client,
      chain: args.chain,
    }),
    constructorParams: args.constructorParams,
    salt: args.salt,
  });
}

export async function computeDeploymentInfoFromBytecode(args: {
  client: ThirdwebClient;
  chain: Chain;
  abi: Abi;
  bytecode: Hex;
  constructorParams?: Record<string, unknown>;
  salt?: string;
}) {
  const { client, chain, constructorParams, salt } = args;
  const create2FactoryAddress = await computeCreate2FactoryAddress({
    client,
    chain,
  });
  const bytecode = ensureBytecodePrefix(args.bytecode);
  const constructorAbi = args.abi.find((abi) => abi.type === "constructor") as
    | AbiConstructor
    | undefined;
  const encodedArgs = encodeAbiParameters(
    constructorAbi?.inputs ?? [],
    normalizeFunctionParams(constructorAbi, constructorParams),
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
