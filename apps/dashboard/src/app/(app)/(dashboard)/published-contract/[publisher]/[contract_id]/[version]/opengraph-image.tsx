import { format } from "date-fns";
import { getSocialProfiles } from "thirdweb/social";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { resolveEns } from "@/lib/ens";
import { correctAndUniqueLicenses } from "@/lib/licenses";
import { getPublishedContractsWithPublisherMapping } from "../utils/getPublishedContractsWithPublisherMapping";
import { publishedContractOGImageTemplate } from "../utils/publishedContractOGImageTemplate";

export const runtime = "edge";

export const size = {
  height: 630,
  width: 1200,
};

export default async function Image(props: {
  params: {
    publisher: string;
    contract_id: string;
    version: string;
  };
}) {
  const { publisher, contract_id } = props.params;

  const [publishedContracts, socialProfiles] = await Promise.all([
    getPublishedContractsWithPublisherMapping({
      client: serverThirdwebClient,
      contract_id: contract_id,
      publisher: publisher,
    }),
    getSocialProfiles({
      address:
        (await resolveEns(publisher, serverThirdwebClient)).address ||
        publisher,
      client: serverThirdwebClient,
    }),
  ]);

  if (!publishedContracts) {
    return null;
  }

  const publisherProfile = (() => {
    const name = socialProfiles.find((p) => p.name)?.name || publisher;
    const avatar = socialProfiles.find((p) => p.avatar)?.avatar;
    return {
      avatar,
      name,
    };
  })();

  const publishedContract =
    publishedContracts.find((p) => p.version === props.params.version) ||
    publishedContracts[0];

  if (!publishedContract) {
    return null;
  }

  const publishedContractName =
    publishedContract?.displayName || publishedContract?.name;

  return publishedContractOGImageTemplate({
    description: publishedContract.description,
    license: correctAndUniqueLicenses(publishedContract.licenses),
    logo: publishedContract.logo,
    publishDate: format(
      new Date(
        Number.parseInt(publishedContract.publishTimestamp.toString() || "0") *
          1000,
      ),
      "MMM dd, yyyy",
    ),
    publisher: publisherProfile?.name || publisher,
    publisherAvatar: publisherProfile?.avatar,
    title: publishedContractName,
    version: publishedContract.version || "latest",
  });
}
