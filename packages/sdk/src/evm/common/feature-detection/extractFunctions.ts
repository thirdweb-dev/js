import { AbiFunction } from "../../schema/contracts/custom";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { extractFunctionsFromAbi } from "./extractFunctionsFromAbi";
import { fetchPreDeployMetadata } from "./fetchPreDeployMetadata";

/**
 * @internal
 * @param predeployMetadataUri - The predeploy metadata URI to fetch
 * @param storage - The storage to use
 */
export async function extractFunctions(
  predeployMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<AbiFunction[]> {
  const metadata = await fetchPreDeployMetadata(predeployMetadataUri, storage);
  return extractFunctionsFromAbi(metadata.abi, metadata.metadata);
}
