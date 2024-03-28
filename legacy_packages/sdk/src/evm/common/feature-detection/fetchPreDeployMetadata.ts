import {
  PreDeployMetadataFetched,
  PreDeployMetadataFetchedSchema,
} from "../../schema/contracts/custom";
import { fetchContractMetadata } from "../fetchContractMetadata";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { fetchRawPredeployMetadata } from "./fetchRawPredeployMetadata";

/**
 * Fetch the metadata coming from CLI, this is before deploying or releasing the contract.
 * @internal
 * @param publishMetadataUri - The publish metadata URI to fetch
 * @param storage - The storage to use
 */
export async function fetchPreDeployMetadata(
  publishMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<PreDeployMetadataFetched> {
  const rawMeta = await fetchRawPredeployMetadata(publishMetadataUri, storage);
  const deployBytecode = await (
    await storage.download(rawMeta.bytecodeUri)
  ).text();
  const parsedMeta = await fetchContractMetadata(rawMeta.metadataUri, storage);
  return PreDeployMetadataFetchedSchema.parse({
    ...rawMeta,
    ...parsedMeta,
    bytecode: deployBytecode,
  });
}
