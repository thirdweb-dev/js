import { getThirdwebClient } from "@/constants/thirdweb.server";
import {
  getAllPublishedContracts,
  getContractPublisher,
} from "thirdweb/extensions/thirdweb";
import invariant from "tiny-invariant";
import { fetchDeployMetadata } from "./fetchDeployMetadata";

export async function fetchPublishedContracts(address?: string | null) {
  invariant(address, "address is not defined");
  const tempResult = (
    (await getAllPublishedContracts({
      contract: getContractPublisher(getThirdwebClient()),
      publisher: address,
    })) || []
  ).filter((c) => c.contractId);
  return await Promise.all(
    tempResult.map(async (c) => ({
      ...c,
      metadata: await fetchDeployMetadata(c.publishMetadataUri),
    })),
  );
}
