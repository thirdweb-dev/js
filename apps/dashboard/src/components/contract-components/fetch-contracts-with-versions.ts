import { getThirdwebClient } from "@/constants/thirdweb.server";
import { isAddress } from "thirdweb";
import { fetchDeployMetadata } from "thirdweb/contract";
import { resolveAddress } from "thirdweb/extensions/ens";
import {
  getContractPublisher,
  getPublishedContractVersions,
} from "thirdweb/extensions/thirdweb";

export function mapThirdwebPublisher(publisher: string) {
  if (publisher === "thirdweb.eth") {
    return "deployer.thirdweb.eth";
  }

  return publisher;
}

export async function fetchPublishedContractVersions(
  publisherAddress: string,
  contractId: string,
) {
  const client = getThirdwebClient();
  const allVersions = await getPublishedContractVersions({
    contract: getContractPublisher(client),
    publisher: isAddress(publisherAddress)
      ? publisherAddress
      : await resolveAddress({
          client,
          name: mapThirdwebPublisher(publisherAddress),
        }),
    contractId: contractId,
  });

  const sortedVersions = allVersions.toSorted((a, b) => {
    if (a.publishTimestamp === b.publishTimestamp) {
      return 0;
    }
    return a.publishTimestamp > b.publishTimestamp ? -1 : 1;
  });

  const responses = await Promise.allSettled(
    sortedVersions.map((v) =>
      fetchDeployMetadata({
        client,
        uri: v.publishMetadataUri,
      }).then((m) => ({ ...m, ...v })),
    ),
  );

  return responses.filter((r) => r.status === "fulfilled").map((r) => r.value);
}

export async function fetchPublishedContractVersion(
  publisherAddress: string,
  contractId: string,
  version = "latest",
) {
  const allVersions = await fetchPublishedContractVersions(
    publisherAddress,
    contractId,
  );
  if (allVersions.length === 0) {
    return null;
  }
  if (version === "latest") {
    return allVersions[0];
  }
  return allVersions.find((v) => v.version === version) || allVersions[0];
}

export type PublishedContractWithVersion = Awaited<
  ReturnType<typeof fetchPublishedContractVersions>
>[number];
