import { getRawAccount } from "../../../../../account/settings/getAccount";
import type { PublicContractPageParams } from "../types";
import { SharedModulesPage } from "./shared-modules-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const [params, account] = await Promise.all([props.params, getRawAccount()]);
  return (
    <SharedModulesPage
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chain_id}
      projectMeta={undefined}
      isLoggedIn={!!account}
    />
  );
}
