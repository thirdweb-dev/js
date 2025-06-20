import type { PublicContractPageParams } from "../types";
import { SharedAnalyticsPage } from "./shared-analytics-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const params = await props.params;
  return (
    <SharedAnalyticsPage
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      projectMeta={undefined}
    />
  );
}
