import { notFound } from "next/navigation";
import { localhost } from "thirdweb/chains";
import {
  isClaimToSupported,
  isMintToSupported,
} from "thirdweb/extensions/erc20";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractTokensPage } from "./ContractTokensPage";
import { ContractTokensPageClient } from "./ContractTokensPage.client";

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

  if (info.contract.chain.id === localhost.id) {
    return <ContractTokensPageClient contract={info.contract} />;
  }

  const { supportedERCs, functionSelectors } = await getContractPageMetadata(
    info.contract,
  );

  return (
    <ContractTokensPage
      contract={info.contract}
      isERC20={supportedERCs.isERC20}
      isMintToSupported={isMintToSupported(functionSelectors)}
      isClaimToSupported={isClaimToSupported(functionSelectors)}
    />
  );
}
