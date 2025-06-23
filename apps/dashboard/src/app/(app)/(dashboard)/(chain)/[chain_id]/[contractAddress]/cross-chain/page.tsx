import type { PublicContractPageParams } from "../types";
import { SharedCrossChainPage } from "./shared-cross-chain-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const params = await props.params;
  return (
    <SharedCrossChainPage
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      projectMeta={undefined}
    />
  );
}
