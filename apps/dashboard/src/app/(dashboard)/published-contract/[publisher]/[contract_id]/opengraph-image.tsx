import { fetchPublisherProfile } from "components/contract-components/fetch-contracts-with-versions";
import { format } from "date-fns/format";
import { correctAndUniqueLicenses } from "lib/licenses";
import { getPublishedContractsWithPublisherMapping } from "./utils/getPublishedContractsWithPublisherMapping";
import { publishedContractOGImageTemplate } from "./utils/publishedContractOGImageTemplate";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export default async function Image(props: {
  params: {
    publisher: string;
    contract_id: string;
  };
}) {
  const { publisher, contract_id } = props.params;

  const [publishedContracts, publisherProfile] = await Promise.all([
    getPublishedContractsWithPublisherMapping({
      publisher: publisher,
      contract_id: contract_id,
    }),
    fetchPublisherProfile(publisher),
  ]);

  const publishedContract = publishedContracts[0];

  const publishedContractName =
    publishedContract?.displayName || publishedContract?.name;

  return publishedContractOGImageTemplate({
    title: publishedContractName,
    description: publishedContract.description,
    version: publishedContract.version || "latest",
    publisher: publisherProfile?.name || publisher,
    license: correctAndUniqueLicenses(publishedContract.licenses),
    publishDate: format(
      new Date(
        Number.parseInt(publishedContract.publishTimestamp.toString() || "0") *
          1000,
      ),
      "MMM dd, yyyy",
    ),
    logo: publishedContract.logo,
    publisherAvatar: publisherProfile?.avatar,
  });
}
