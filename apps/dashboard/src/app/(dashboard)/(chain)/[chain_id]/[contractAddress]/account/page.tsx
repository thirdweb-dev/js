import { notFound, redirect } from "next/navigation";
import { AccountPage } from "../../../../../../contract-ui/tabs/account/page";
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

  const { contract, chainMetadata } = info;
  const { isAccount } = await getContractPageMetadata(contract);

  if (!isAccount) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <AccountPage contract={contract} chainMetadata={chainMetadata} />;
}
