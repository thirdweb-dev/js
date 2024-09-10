import { thirdwebClient } from "@/constants/client";
import { type ThirdwebContract, getContract, isAddress } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { fetchDeployMetadata } from "thirdweb/contract";
import { resolveAddress } from "thirdweb/extensions/ens";
import { getPublishedContractVersions } from "thirdweb/extensions/thirdweb";

let publisherContract: ThirdwebContract;
function getPublisherContract() {
  if (!publisherContract) {
    publisherContract = getContract({
      client: thirdwebClient,
      address: "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808",
      chain: polygon,
    });
  }
  return publisherContract;
}

export async function fetchPublishedContractVersions(
  publisherAddress: string,
  contractId: string,
) {
  const allVersions = await getPublishedContractVersions({
    contract: getPublisherContract(),
    publisher: isAddress(publisherAddress)
      ? publisherAddress
      : await resolveAddress({
          client: thirdwebClient,
          name: publisherAddress,
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
        client: thirdwebClient,
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
