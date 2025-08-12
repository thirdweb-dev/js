import type { ThirdwebClient } from "thirdweb";
import { fetchDeployMetadata as sdkFetchDeployMetadata } from "thirdweb/contract";
import { removeUndefinedFromObjectDeep } from "@/utils/object";
import type { ContractId } from "../../components/contract-components/types";

// metadata PRE publish, only has the compiler output info (from CLI)

export async function fetchDeployMetadata(
  contractId: string,
  client: ThirdwebClient,
) {
  const contractIdIpfsHash = toContractIdIpfsHash(contractId);

  return removeUndefinedFromObjectDeep(
    await sdkFetchDeployMetadata({
      client,
      uri: contractIdIpfsHash,
    }),
  );
}

function toContractIdIpfsHash(contractId: ContractId) {
  if (contractId?.startsWith("ipfs://")) {
    return contractId;
  }
  return `ipfs://${contractId}`;
}
