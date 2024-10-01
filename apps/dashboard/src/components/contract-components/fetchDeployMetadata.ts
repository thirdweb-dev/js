import { getThirdwebClient } from "@/constants/thirdweb.server";
import { fetchDeployMetadata as sdkFetchDeployMetadata } from "thirdweb/contract";
import { removeUndefinedFromObjectDeep } from "../../utils/object";
import { toContractIdIpfsHash } from "./hooks";

// metadata PRE publish, only has the compiler output info (from CLI)

export async function fetchDeployMetadata(contractId: string) {
  const contractIdIpfsHash = toContractIdIpfsHash(contractId);

  return removeUndefinedFromObjectDeep(
    await sdkFetchDeployMetadata({
      client: getThirdwebClient(),
      uri: contractIdIpfsHash,
    }),
  );
}
