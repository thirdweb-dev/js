import { notFound, redirect } from "next/navigation";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { AccountPage } from "./AccountPage";
import { AccountPageClient } from "./AccountPage.client";

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

  const { clientContract, serverContract, chainMetadata, isLocalhostChain } =
    info;

  const account = await getRawAccount();

  if (isLocalhostChain) {
    return (
      <AccountPageClient
        contract={clientContract}
        chainMetadata={chainMetadata}
        isLoggedIn={!!account}
      />
    );
  }

  const { isAccount, isInsightSupported } =
    await getContractPageMetadata(serverContract);

  if (!isAccount) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <AccountPage
      contract={clientContract}
      chainMetadata={chainMetadata}
      isLoggedIn={!!account}
      isInsightSupported={isInsightSupported}
    />
  );
}
