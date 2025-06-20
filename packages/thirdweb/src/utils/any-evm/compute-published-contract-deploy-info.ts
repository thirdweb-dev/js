import type { Abi, AbiConstructor } from "abitype";
import { encodePacked } from "viem";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { fetchPublishedContractMetadata } from "../../contract/deployment/publisher.js";
import { computeCreate2FactoryAddress } from "../../contract/deployment/utils/create-2-factory.js";
import { computeRefDeployments } from "../../extensions/prebuilts/compute-ref-deployments.js";
import type { ImplementationConstructorParam } from "../../extensions/prebuilts/process-ref-deployments.js";
import { encodeAbiParameters } from "../abi/encodeAbiParameters.js";
import { normalizeFunctionParams } from "../abi/normalizeFunctionParams.js";
import { ensureBytecodePrefix } from "../bytecode/prefix.js";
import type { Hex } from "../encoding/hex.js";
import {
  type FetchDeployMetadataResult,
  fetchBytecodeFromCompilerMetadata,
} from "./deploy-metadata.js";
import { encodeExtraDataWithUri } from "./encode-extra-data-with-uri.js";
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
    chain,
    client,
    constructorParams,
    contractMetadata,
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
  const { client, chain, constructorParams, contractMetadata } = args;
  const definedConstructorParams =
    constructorParams || contractMetadata.constructorParams;
  let processedConstructorParams: Record<string, string | string[]> | undefined;
  if (definedConstructorParams) {
    processedConstructorParams = {};
    for (const key in definedConstructorParams) {
      processedConstructorParams[key] = await computeRefDeployments({
        chain,
        client,
        paramValue: definedConstructorParams[key] as
          | string
          | ImplementationConstructorParam,
      });
    }
  }

  const isStylus = contractMetadata.metadata.language === "rust";
  return computeDeploymentInfoFromBytecode({
    abi: args.contractMetadata.abi,
    bytecode: await fetchBytecodeFromCompilerMetadata({
      chain: args.chain,
      client: args.client,
      compilerMetadata: args.contractMetadata,
    }),
    chain: args.chain,
    client: args.client,
    constructorParams: processedConstructorParams,
    extraDataWithUri: isStylus
      ? encodeExtraDataWithUri({
          metadataUri: contractMetadata.metadataUri,
        })
      : undefined,
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
  extraDataWithUri?: Hex;
}) {
  const { client, chain, constructorParams, salt, extraDataWithUri } = args;
  const create2FactoryAddress = await computeCreate2FactoryAddress({
    chain,
    client,
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

  const initCalldata = extraDataWithUri
    ? encodePacked(["bytes", "bytes"], [initBytecodeWithsalt, extraDataWithUri])
    : initBytecodeWithsalt;
  return {
    bytecode,
    create2FactoryAddress,
    encodedArgs,
    extraDataWithUri,
    initCalldata,
    salt,
  };
}
