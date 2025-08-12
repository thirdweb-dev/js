"use client";
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
  isLoggedIn: boolean;
}) {
  const metadataQuery = useContractPageMetadata(props.contract);

  if (metadataQuery.isPending) {
    return <LoadingPage />;
  }

  if (metadataQuery.isError) {
    return <ErrorPage />;
  }

  const { functionSelectors } = metadataQuery.data;

  return (
    <ContractTokensPage
      contract={props.contract}
      isClaimToSupported={isClaimToSupported(functionSelectors)}
      isLoggedIn={props.isLoggedIn}
      isMintToSupported={isMintToSupported(functionSelectors)}
    />
  );
}
