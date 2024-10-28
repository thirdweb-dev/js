import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { AccountsPage } from "./AccountsPage";
import { AccountsPageClient } from "./AccountsPage.client";

export default async function Page(props: {
  params: {
    contractAddress: string;
    chain_id: string;
  };
}) {
  const info = await getContractPageParamsInfo(props.params);

  if (!info) {
    notFound();
  }

  const { contract, chainMetadata } = info;

  if (chainMetadata.chainId === localhost.id) {
    return <AccountsPageClient contract={contract} />;
  }

  const { isAccountFactory } = await getContractPageMetadata(contract);

  if (!isAccountFactory) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <AccountsPage contract={contract} />;
}
