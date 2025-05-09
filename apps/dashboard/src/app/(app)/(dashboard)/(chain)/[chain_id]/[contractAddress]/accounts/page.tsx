import { notFound, redirect } from "next/navigation";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { AccountsPage } from "./AccountsPage";
import { AccountsPageClient } from "./AccountsPage.client";

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}) {
  const params = await props.params;
  const info = await getContractPageParamsInfo(params);

  if (!info) {
    notFound();
  }

  const { clientContract, serverContract, isLocalhostChain } = info;

  const [account, { isAccountFactory }] = await Promise.all([
    getRawAccount(),
    isLocalhostChain
      ? { isAccountFactory: undefined }
      : getContractPageMetadata(serverContract),
  ]);

  if (isLocalhostChain) {
    return (
      <AccountsPageClient contract={clientContract} isLoggedIn={!!account} />
    );
  }

  if (!isAccountFactory) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return <AccountsPage contract={clientContract} isLoggedIn={!!account} />;
}
