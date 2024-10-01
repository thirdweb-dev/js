import { notFound, redirect } from "next/navigation";
import { AccountsPage } from "../../../../../../contract-ui/tabs/accounts/page";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";

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

  const { contract } = info;
  const { isAccountFactory } = await getContractPageMetadata(contract);

  if (!isAccountFactory) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <AccountsPage contract={contract} />;
}
