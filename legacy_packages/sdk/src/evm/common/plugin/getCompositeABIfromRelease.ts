import { Abi } from "../../schema/contracts/custom";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { fetchAndCacheDeployMetadata } from "../any-evm-utils/fetchAndCacheDeployMetadata";

export async function getCompositeABIfromRelease(
  publishMetadataUri: string,
  storage: ThirdwebStorage,
): Promise<Abi> {
  const { extendedMetadata } = await fetchAndCacheDeployMetadata(
    publishMetadataUri,
    storage,
  );

  const compositeAbi = extendedMetadata?.compositeAbi || [];

  return compositeAbi;
}
