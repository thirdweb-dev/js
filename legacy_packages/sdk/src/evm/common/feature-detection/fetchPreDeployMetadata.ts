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

  // TODO: Add an invariant, throw if no compilers in rawMeta in case compilerOptions are provided.
  // Keeping it this way until all contracts are republished with new metadata.
  if (compilerOptions && rawMeta.compilers) {
    let metadata;
    switch (compilerOptions.compilerType) {
      case "solc": {
        if (compilerOptions.compilerVersion) {
          metadata = rawMeta.compilers.solc?.find(
            (m) =>
              m.compilerVersion === compilerOptions.compilerVersion &&
              m.evmVersion === compilerOptions.evmVersion,
          );
        } else if (rawMeta.compilers.solc) {
          const len = rawMeta.compilers.solc.length;
          metadata = rawMeta.compilers.solc[len - 1];
        }
        break;
      }
      case "zksolc": {
        if (compilerOptions.compilerVersion) {
          metadata = rawMeta.compilers.zksolc?.find(
            (m) =>
              m.compilerVersion === compilerOptions.compilerVersion &&
              m.evmVersion === compilerOptions.evmVersion,
          );
        } else if (rawMeta.compilers.zksolc) {
          const len = rawMeta.compilers.zksolc.length;
          metadata = rawMeta.compilers.zksolc[len - 1];
        }
        break;
      }
    }
    invariant(metadata, "Compiler or EVM version not found");

    bytecodeUri = metadata.bytecodeUri;
    metadataUri = metadata.metadataUri;
  } else {
    bytecodeUri = rawMeta.bytecodeUri;
    metadataUri = rawMeta.metadataUri;
  }

  const [deployBytecode, parsedMeta] = await Promise.all([
    storage.download(bytecodeUri),
    fetchContractMetadata(metadataUri, storage),
  ]);

  return PreDeployMetadataFetchedSchema.parse({
    ...rawMeta,
    ...parsedMeta,
    name: rawMeta.name,
    bytecode: await deployBytecode.text(),
    fetchedMetadataUri: metadataUri,
    fetchedBytecodeUri: bytecodeUri,
  });
}
