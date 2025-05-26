import type { PublicContractPageParams } from "../types";
import { SharedCrossChainPage } from "./shared-cross-chain-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const params = await props.params;
  return (
    <SharedCrossChainPage
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chain_id}
      projectMeta={undefined}
    />
  );
}
