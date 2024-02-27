import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { fetchExtendedReleaseMetadata } from "../feature-detection/fetchExtendedReleaseMetadata";
import { fetchPreDeployMetadata } from "../feature-detection/fetchPreDeployMetadata";
import type { DeployMetadata } from "../../types/deploy/deploy-options";
import { createLruCache } from "../utils";
import {
  FullPublishMetadata,
  PreDeployMetadataFetched,
} from "../../schema/contracts/custom";

type DeployAndPublishMetadata = {
  compilerMetadata: PreDeployMetadataFetched;
  extendedMetadata: FullPublishMetadata | undefined;
};

const deployMetadataCache =
  /* @__PURE__ */ createLruCache<DeployAndPublishMetadata>(20);

/**
 * @internal
 */
export async function fetchAndCacheDeployMetadata(
  publishMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<DeployMetadata> {
  const cached = deployMetadataCache.get(publishMetadataUri);
  if (cached) {
    return cached;
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
  deployMetadataCache.put(publishMetadataUri, data);
  return data;
}
