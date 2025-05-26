import type { PublicContractPageParams } from "../types";
import { SharedCodePage } from "./shared-code-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const params = await props.params;
  return (
    <SharedCodePage
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chain_id}
      projectMeta={undefined}
    />
  );
}
