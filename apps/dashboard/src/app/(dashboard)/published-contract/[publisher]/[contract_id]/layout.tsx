import { notFound } from "next/navigation";
import { PublishedContractBreadcrumbs } from "./components/breadcrumbs.client";
import { getPublishedContractsWithPublisherMapping } from "./utils/getPublishedContractsWithPublisherMapping";

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

  const publishedContracts = await getPublishedContractsWithPublisherMapping({
    publisher: publisher,
    contract_id: contract_id,
  });

  if (!publishedContracts) {
    notFound();
  }

  const publishedContract = publishedContracts[0];

  if (!publishedContract) {
    return {
      title: `${contract_id} | Published Smart Contract`,
      description: `Deploy ${contract_id} Smart Contract in one click with thirdweb.`,
    };
  }

  const publishedContractName =
    publishedContract?.displayName || publishedContract?.name;

  return {
    title: `${publishedContractName} | Published Smart Contract`,
    description: `${publishedContract.description}${publishedContract.description ? ". " : ""}Deploy ${publishedContractName} in one click with thirdweb.`,
  };
}
