import { PreDeployMetadata } from "../../schema/contracts/custom";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

/**
 * @internal
 * @param publishMetadataUri
 * @param storage
 */
export async function fetchRawPredeployMetadata(
  publishMetadataUri: string,
  storage: ThirdwebStorage,
) {
  return PreDeployMetadata.parse(
    JSON.parse(await (await storage.download(publishMetadataUri)).text()),
  );
}
