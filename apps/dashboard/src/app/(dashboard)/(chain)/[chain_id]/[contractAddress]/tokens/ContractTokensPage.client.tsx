"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebContract } from "thirdweb";
import {
  isClaimToSupported,
  isMintToSupported,
} from "thirdweb/extensions/erc20";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { ContractTokensPage } from "./ContractTokensPage";

export function ContractTokensPageClient(props: {
  contract: ThirdwebContract;
  twAccount: Account | undefined;
}) {
  const metadataQuery = useContractPageMetadata(props.contract);

  if (metadataQuery.isPending) {
    return <LoadingPage />;
  }

  if (metadataQuery.isError) {
    return <ErrorPage />;
  }

  const { supportedERCs, functionSelectors } = metadataQuery.data;

  return (
    <ContractTokensPage
      contract={props.contract}
      isERC20={supportedERCs.isERC20}
      isMintToSupported={isMintToSupported(functionSelectors)}
      isClaimToSupported={isClaimToSupported(functionSelectors)}
      twAccount={props.twAccount}
    />
  );
}
