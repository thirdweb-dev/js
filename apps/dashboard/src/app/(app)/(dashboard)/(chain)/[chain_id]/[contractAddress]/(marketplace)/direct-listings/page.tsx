import { getRawAccount } from "../../../../../../account/settings/getAccount";
import type { PublicContractPageParams } from "../../types";
import { SharedDirectListingsPage } from "./shared-direct-listings-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const [params, account] = await Promise.all([props.params, getRawAccount()]);

  return (
    <SharedDirectListingsPage
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      isLoggedIn={!!account}
      projectMeta={undefined}
    />
  );
}
