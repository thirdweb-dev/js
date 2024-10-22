import { notFound, redirect } from "next/navigation";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { AccountsPage } from "./AccountsPage";

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}) {
  const info = await getContractPageParamsInfo((await props.params));

  if (!info) {
    notFound();
  }

  const { contract } = info;
  const { isAccountFactory } = await getContractPageMetadata(contract);

  if (!isAccountFactory) {
    redirect(`/${(await props.params).chain_id}/${(await props.params).contractAddress}`);
  }

  return <AccountsPage contract={contract} />;
}
