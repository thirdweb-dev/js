import type { PublicContractPageParams } from "../types";
import { SharedEventsPage } from "./shared-events-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const params = await props.params;
  return (
    <SharedEventsPage
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chain_id}
      projectMeta={undefined}
    />
  );
}
