import { getRawAccount } from "../../../../../account/settings/getAccount";
import type { PublicContractPageParams } from "../types";
import { SharedAccountsPage } from "./shared-accounts-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const [params, account] = await Promise.all([props.params, getRawAccount()]);
  return (
    <SharedAccountsPage
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chain_id}
      projectMeta={undefined}
      isLoggedIn={!!account}
    />
  );
}
