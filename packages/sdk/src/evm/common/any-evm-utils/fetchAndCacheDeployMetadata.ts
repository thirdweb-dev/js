import { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  fetchExtendedReleaseMetadata,
  fetchPreDeployMetadata,
} from "../feature-detection";
import { DeployMetadata } from "../../types";
import { caches } from "./caches";

export async function fetchAndCacheDeployMetadata(
  publishMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<DeployMetadata> {
  if (caches.deployMetadataCache[publishMetadataUri]) {
    return caches.deployMetadataCache[publishMetadataUri];
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
  caches.deployMetadataCache[publishMetadataUri] = data;
  return data;
}
