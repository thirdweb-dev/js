import { PublishedContractBreadcrumbs } from "./components/breadcrumbs.client";
import { getPublishedContractsWithPublisherMapping } from "./utils/getPublishedContractsWithPublisherMapping";

type Params = { publisher: string; contract_id: string };

export default function PublishedContractLayout(props: {
  children: React.ReactNode;
  params: Params;
}) {
  return (
    <div className="flex flex-col">
      <PublishedContractBreadcrumbs />
      <div className="container flex flex-col gap-8 py-8">{props.children}</div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const { publisher, contract_id } = params;

  const publishedContracts = await getPublishedContractsWithPublisherMapping({
    publisher: publisher,
    contract_id: contract_id,
  });

  const publishedContract = publishedContracts[0];

  const publishedContractName =
    publishedContract?.displayName || publishedContract?.name;

  return {
    title: `${publishedContractName} | Published Smart Contract`,
    description: `${publishedContract.description}${publishedContract.description ? ". " : ""}Deploy ${publishedContractName} in one click with thirdweb.`,
  };
}
