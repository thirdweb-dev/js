import { notFound } from "next/navigation";
import {
  isClaimToSupported,
  isMintToSupported,
} from "thirdweb/extensions/erc20";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractTokensPage } from "./ContractTokensPage";
import { ContractTokensPageClient } from "./ContractTokensPage.client";

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

  const account = await getRawAccount();

  if (info.isLocalhostChain) {
    return (
      <ContractTokensPageClient
        contract={info.clientContract}
        isLoggedIn={!!account}
      />
    );
  }

  const { supportedERCs, functionSelectors } = await getContractPageMetadata(
    info.serverContract,
  );

  return (
    <ContractTokensPage
      contract={info.clientContract}
      isERC20={supportedERCs.isERC20}
      isMintToSupported={isMintToSupported(functionSelectors)}
      isClaimToSupported={isClaimToSupported(functionSelectors)}
      isLoggedIn={!!account}
    />
  );
}
