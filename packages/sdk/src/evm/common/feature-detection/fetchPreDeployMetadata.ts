import {
  PreDeployMetadataFetched,
  PreDeployMetadataFetchedSchema,
} from "../../schema/contracts/custom";
import { fetchContractMetadata } from "../fetchContractMetadata";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { fetchRawPredeployMetadata } from "./fetchRawPredeployMetadata";
import { CompilerOptions } from "../../types/compiler/compiler-options";
import invariant from "tiny-invariant";

/**
 * Fetch the metadata coming from CLI, this is before deploying or releasing the contract.
 * @internal
 * @param publishMetadataUri - The publish metadata URI to fetch
 * @param storage - The storage to use
 */
export async function fetchPreDeployMetadata(
  publishMetadataUri: string,
  storage: ThirdwebStorage,
  compilerOptions?: CompilerOptions,
): Promise<PreDeployMetadataFetched> {
  const rawMeta = await fetchRawPredeployMetadata(publishMetadataUri, storage);

  let bytecodeUri;
  let metadataUri;

  if (compilerOptions) {
    invariant(rawMeta.compilers, "Specified compiler not found");
    let metadata;
    switch (compilerOptions.compilerType) {
      case "solc":
        metadata = rawMeta.compilers.solc?.find(
          (m) =>
            m.compilerVersion === compilerOptions.compilerVersion &&
            m.evmVersion === compilerOptions.evmVersion,
        );
        break;
      case "zksolc":
        metadata = rawMeta.compilers.zksolc?.find(
          (m) =>
            m.compilerVersion === compilerOptions.compilerVersion &&
            m.evmVersion === compilerOptions.evmVersion,
        );
        break;
    }
    invariant(metadata, "Compiler or EVM version not found");

    bytecodeUri = metadata.bytecodeUri;
    metadataUri = metadata.metadataUri;
  } else {
    bytecodeUri = rawMeta.bytecodeUri;
    metadataUri = rawMeta.metadataUri;
  }

  const deployBytecode = await (await storage.download(bytecodeUri)).text();
  const parsedMeta = await fetchContractMetadata(metadataUri, storage);
  return PreDeployMetadataFetchedSchema.parse({
    ...rawMeta,
    ...parsedMeta,
    bytecode: deployBytecode,
  });
}
