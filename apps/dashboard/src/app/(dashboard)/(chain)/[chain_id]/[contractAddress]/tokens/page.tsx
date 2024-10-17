import { notFound } from "next/navigation";
import {
  isClaimToSupported,
  isMintToSupported,
} from "thirdweb/extensions/erc20";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractTokensPage } from "./ContractTokensPage";

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
