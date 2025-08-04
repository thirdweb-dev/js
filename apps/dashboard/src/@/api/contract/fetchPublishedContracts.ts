import type { ThirdwebClient } from "thirdweb";
import {
  getAllPublishedContracts,
  getContractPublisher,
} from "thirdweb/extensions/thirdweb";
import { resolveEns } from "@/lib/ens";
import { fetchDeployMetadata } from "./fetchDeployMetadata";

// TODO: clean this up, jesus
export async function fetchPublishedContracts(params: {
  address?: string | null;
  client: ThirdwebClient;
}) {
  const { address, client } = params;
  try {
    if (!address) {
      return [];
    }
    const resolvedAddress = (await resolveEns(address, client)).address;

    if (!resolvedAddress) {
      return [];
    }

    const tempResult = (
      (await getAllPublishedContracts({
        contract: getContractPublisher(client),
        publisher: resolvedAddress,
      })) || []
    )
      .filter((c) => c.contractId)
      .sort((a, b) => a.contractId.localeCompare(b.contractId));

    return await Promise.all(
      tempResult.map(async (c) => ({
        ...c,
        metadata: await fetchDeployMetadata(c.publishMetadataUri, client),
      })),
    );
  } catch (e) {
    console.error("Error fetching published contracts", e);
    return [];
  }
}
