import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { AccountSignersClient } from "./AccountSigners.client";
import { AccountSigners } from "./components/account-signers";

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
    return <AccountSignersClient contract={contract} />;
  }

  const { isAccountPermissionsSupported } =
    await getContractPageMetadata(contract);

  if (!isAccountPermissionsSupported) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <AccountSigners contract={contract} />;
}
