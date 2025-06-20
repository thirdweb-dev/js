import { SharedContractOverviewPage } from "./shared-overview-page";
import type { PublicContractPageParams } from "./types";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const params = await props.params;
  return (
    <SharedContractOverviewPage
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      projectMeta={undefined}
    />
  );
}
