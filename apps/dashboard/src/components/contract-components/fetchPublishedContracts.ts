import { getThirdwebClient } from "@/constants/thirdweb.server";
import { resolveEns } from "lib/ens";
import {
  getAllPublishedContracts,
  getContractPublisher,
} from "thirdweb/extensions/thirdweb";
import invariant from "tiny-invariant";
import { fetchDeployMetadata } from "./fetchDeployMetadata";

export async function fetchPublishedContracts(address?: string | null) {
  invariant(address, "address is not defined");
  const resolvedAddress = (await resolveEns(address)).address;
  invariant(resolvedAddress, "invalid ENS");
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
}
