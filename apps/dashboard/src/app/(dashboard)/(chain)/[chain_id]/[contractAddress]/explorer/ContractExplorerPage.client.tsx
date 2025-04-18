"use client";

import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { LoadingPage } from "../_components/page-skeletons";
import { useResolveContractABI } from "../_hooks/useResolveContractABI";
import { ContractExplorerPage } from "./ContractExplorerPage";

interface ContractExplorePageProps {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  isLoggedIn: boolean;
}

export const ContractExplorerPageClient: React.FC<ContractExplorePageProps> = ({
  contract,
  chainMetadata,
  isLoggedIn,
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
      isLoggedIn={isLoggedIn}
    />
  );
};
