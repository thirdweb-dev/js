"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { LoadingPage } from "../_components/page-skeletons";
import { useResolveContractABI } from "../_hooks/useResolveContractABI";
import { ContractExplorerPage } from "./ContractExplorerPage";

interface ContractExplorePageProps {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  twAccount: Account | undefined;
}

export const ContractExplorerPageClient: React.FC<ContractExplorePageProps> = ({
  contract,
  chainMetadata,
  twAccount,
}) => {
  const abiQuery = useResolveContractABI(contract);

  if (abiQuery.isPending) {
    return <LoadingPage />;
  }

  return (
    <ContractExplorerPage
      abi={abiQuery.data}
      contract={contract}
      chainMetadata={chainMetadata}
      twAccount={twAccount}
    />
  );
};
