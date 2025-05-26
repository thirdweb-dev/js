import { SharedContractOverviewPage } from "./shared-overview-page";
import type { PublicContractPageParams } from "./types";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const params = await props.params;
  return (
    <SharedContractOverviewPage
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chain_id}
      projectMeta={undefined}
    />
  );
}
