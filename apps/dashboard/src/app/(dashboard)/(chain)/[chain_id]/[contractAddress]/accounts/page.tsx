import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
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

  const { contract, chainMetadata } = info;

  const account = await getRawAccount();

  if (chainMetadata.chainId === localhost.id) {
    return <AccountsPageClient contract={contract} twAccount={account} />;
  }

  const { isAccountFactory } = await getContractPageMetadata(contract);

  if (!isAccountFactory) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return <AccountsPage contract={contract} twAccount={account} />;
}
