import { notFound, redirect } from "next/navigation";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { AccountSignersClient } from "./AccountSigners.client";
import { AccountSigners } from "./components/account-signers";

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

  if (isLocalhostChain) {
    return <AccountSignersClient contract={clientContract} />;
  }

  const { isAccountPermissionsSupported } =
    await getContractPageMetadata(serverContract);

  if (!isAccountPermissionsSupported) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return <AccountSigners contract={clientContract} />;
}
