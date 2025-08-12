import { getRawAccount } from "@/api/account/get-account";
import type { PublicContractPageParams } from "../types";
import { SharedExplorerPage } from "./shared-explorer-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const params = await props.params;
  const account = await getRawAccount();
  return (
    <SharedExplorerPage
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      isLoggedIn={!!account}
      projectMeta={undefined}
    />
  );
}
