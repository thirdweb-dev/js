import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { fetchExtendedReleaseMetadata } from "../feature-detection/fetchExtendedReleaseMetadata";
import { fetchPreDeployMetadata } from "../feature-detection/fetchPreDeployMetadata";
import type { DeployMetadata } from "../../types/deploy/deploy-options";
import { CompilerOptions } from "../../types/compiler/compiler-options";
import { CompilerType } from "../../schema/contracts/custom";

const deployMetadataCache: Record<string, Record<string, any>> = {};

export async function fetchAndCacheDeployMetadata(
  publishMetadataUri: string,
  storage: ThirdwebStorage,
  compilerOptions?: CompilerOptions,
): Promise<DeployMetadata> {
  let compiler = compilerOptions
    ? `${compilerOptions.compilerType}_${
        compilerOptions.compilerVersion || ""
      }_${compilerOptions.evmVersion || ""}
      `
    : "default";

  if (deployMetadataCache[compiler][publishMetadataUri]) {
    return deployMetadataCache[compiler][publishMetadataUri];
  }

  const compilerMetadata = await fetchPreDeployMetadata(
    publishMetadataUri,
    storage,
    compilerOptions,
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
  deployMetadataCache[compiler][publishMetadataUri] = data;
  return data;
}
