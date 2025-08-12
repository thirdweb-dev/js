import { getRawAccount } from "@/api/account/get-account";
import type { PublicContractPageParams } from "../types";
import { SharedAccountsPage } from "./shared-accounts-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const [params, account] = await Promise.all([props.params, getRawAccount()]);
  return (
    <SharedAccountsPage
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      isLoggedIn={!!account}
      projectMeta={undefined}
    />
  );
}
