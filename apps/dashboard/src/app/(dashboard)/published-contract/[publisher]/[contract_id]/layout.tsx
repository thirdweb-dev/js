import { PublishedContractBreadcrumbs } from "./components/breadcrumbs.client";
import { getPublishedContractPageMetadata } from "./utils/getPublishedContractPageMetadata";

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
  return getPublishedContractPageMetadata({
    publisher: params.publisher,
    contract_id: params.contract_id,
    pageType: "view",
  });
}
