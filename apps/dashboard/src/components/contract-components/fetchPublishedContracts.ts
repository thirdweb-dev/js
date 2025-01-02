import { getThirdwebClient } from "@/constants/thirdweb.server";
import { resolveEns } from "lib/ens";
import {
  getAllPublishedContracts,
  getContractPublisher,
} from "thirdweb/extensions/thirdweb";
import { fetchDeployMetadata } from "./fetchDeployMetadata";

// TODO: clean this up, jesus
export async function fetchPublishedContracts(address?: string | null) {
  try {
    if (!address) {
      return [];
    }
    const resolvedAddress = (await resolveEns(address)).address;

    if (!resolvedAddress) {
      return [];
    }

    const tempResult = (
      (await getAllPublishedContracts({
        contract: getContractPublisher(getThirdwebClient()),
        publisher: resolvedAddress,
      })) || []
    )
      .filter((c) => c.contractId)
      .sort((a, b) => a.contractId.localeCompare(b.contractId));

    return await Promise.all(
      tempResult.map(async (c) => ({
        ...c,
        metadata: await fetchDeployMetadata(c.publishMetadataUri),
      })),
    );
  } catch (e) {
    console.error("Error fetching published contracts", e);
    return [];
  }
}
