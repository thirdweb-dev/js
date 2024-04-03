import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { extractConstructorParamsFromAbi } from "./extractConstructorParamsFromAbi";
import { fetchPreDeployMetadata } from "./fetchPreDeployMetadata";

/**
 * @internal
 */
export async function extractConstructorParams(
  predeployMetadataUri: string,
  storage: ThirdwebStorage,
) {
  const meta = await fetchPreDeployMetadata(predeployMetadataUri, storage);
  return extractConstructorParamsFromAbi(meta.abi);
}
