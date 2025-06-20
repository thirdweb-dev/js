import { getRawAccount } from "../../../../../account/settings/getAccount";
import type { PublicContractPageParams } from "../types";
import { SharedPermissionsPage } from "./shared-permissions-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const [params, account] = await Promise.all([props.params, getRawAccount()]);
  return (
    <SharedPermissionsPage
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      isLoggedIn={!!account}
      projectMeta={undefined}
    />
  );
}
