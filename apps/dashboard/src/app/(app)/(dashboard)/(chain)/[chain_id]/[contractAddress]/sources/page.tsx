import type { PublicContractPageParams } from "../types";
import { SharedContractSourcesPage } from "./shared-sources-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const params = await props.params;
  return (
    <SharedContractSourcesPage
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      projectMeta={undefined}
    />
  );
}
