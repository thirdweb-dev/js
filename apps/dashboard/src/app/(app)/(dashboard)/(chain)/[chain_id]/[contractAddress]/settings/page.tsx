import { getRawAccount } from "../../../../../account/settings/getAccount";
import type { PublicContractPageParams } from "../types";
import { SharedContractSettingsPage } from "./shared-settings-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const [params, account] = await Promise.all([props.params, getRawAccount()]);

  return (
    <SharedContractSettingsPage
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      isLoggedIn={!!account}
      projectMeta={undefined}
    />
  );
}
