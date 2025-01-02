"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebContract } from "thirdweb";
import { ClaimConditions } from "../_components/claim-conditions/claim-conditions";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { RedirectToContractOverview } from "../_components/redirect-contract-overview.client";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";

export function ClaimConditionsClient(props: {
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

  const {
    isERC20ClaimConditionsSupported,
    isERC721ClaimConditionsSupported,
    supportedERCs,
  } = metadataQuery.data;

  if (!isERC20ClaimConditionsSupported && !isERC721ClaimConditionsSupported) {
    return <RedirectToContractOverview contract={props.contract} />;
  }

  return (
    <ClaimConditions
      contract={props.contract}
      isERC20={supportedERCs.isERC20}
      twAccount={props.twAccount}
    />
  );
}
