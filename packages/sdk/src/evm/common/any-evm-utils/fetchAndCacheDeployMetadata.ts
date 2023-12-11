import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { fetchExtendedReleaseMetadata } from "../feature-detection/fetchExtendedReleaseMetadata";
import { fetchPreDeployMetadata } from "../feature-detection/fetchPreDeployMetadata";
import type { DeployMetadata } from "../../types/deploy/deploy-options";

const deployMetadataCache: Record<string, any> = {};

/**
 * @internal
 */
export async function fetchAndCacheDeployMetadata(
  publishMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<DeployMetadata> {
  if (deployMetadataCache[publishMetadataUri]) {
    return deployMetadataCache[publishMetadataUri];
  }
  const compilerMetadata = await fetchPreDeployMetadata(
    publishMetadataUri,
    storage,
  );
  let extendedMetadata;
  try {
    extendedMetadata = await fetchExtendedReleaseMetadata(
      publishMetadataUri,
      storage,
    );
  } catch (e) {
    // not a factory deployment, ignore
  }
  const data = {
    compilerMetadata,
    extendedMetadata,
  };
  deployMetadataCache[publishMetadataUri] = data;
  return data;
}
