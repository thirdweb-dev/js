"use client";

import { Flex } from "@chakra-ui/react";
import type { Abi } from "abitype";
import { getContractFunctionsFromAbi } from "components/contract-components/getContractFunctionsFromAbi";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import type { ThirdwebContract } from "thirdweb";

// TODO - figure out why we have to add "use client" here and it does not work without it

interface ContractExplorePageProps {
  contract: ThirdwebContract;
  abi: Abi;
}
export const ContractExplorerPage: React.FC<ContractExplorePageProps> = ({
  contract,
  abi,
}) => {
  const functions = getContractFunctionsFromAbi(abi);
  return (
    <Flex direction="column" h="70vh">
      {functions && functions.length > 0 ? (
        <ContractFunctionsOverview
          onlyFunctions
          functions={functions}
          contract={contract}
        />
      ) : (
        <div className="flex items-center justify-center">
          <Flex direction="column" textAlign="center" gap={2}>
            <h2 className="font-semibold text-2xl tracking-tight">
              No callable functions discovered in ABI.
            </h2>
            <p className="text-muted-foreground text-sm">
              Please note that proxy contracts are not yet supported in the
              explorer, check back soon for full proxy support.
            </p>
          </Flex>
        </div>
      )}
    </Flex>
  );
};
