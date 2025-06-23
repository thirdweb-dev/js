import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { PublishedContractBreadcrumbs } from "./components/breadcrumbs.client";
import { getLatestPublishedContractsWithPublisherMapping } from "./utils/getPublishedContractsWithPublisherMapping";

type Params = { publisher: string; contract_id: string };

export default function PublishedContractLayout(props: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  return (
    <div className="flex flex-col">
      <PublishedContractBreadcrumbs />
      <div className="container flex flex-col gap-8 py-8">{props.children}</div>
    </div>
  );
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const params = await props.params;
  const { publisher, contract_id } = params;

  const publishedContract =
    await getLatestPublishedContractsWithPublisherMapping({
      client: serverThirdwebClient,
      contract_id: contract_id,
      publisher: publisher,
    });

  if (!publishedContract) {
    return {
      description: `Deploy ${contract_id} Smart Contract in one click with thirdweb.`,
      title: `${contract_id} | Published Smart Contract`,
    };
  }

  const publishedContractName =
    publishedContract?.displayName || publishedContract?.name;

  return {
    description: `${publishedContract.description}${publishedContract.description ? ". " : ""}Deploy ${publishedContractName} in one click with thirdweb.`,
    title: `${publishedContractName} | Published Smart Contract`,
  };
}
