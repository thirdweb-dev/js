import { Center, Flex, Skeleton } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useContractFunctions } from "components/contract-components/hooks";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import type { ThirdwebContract } from "thirdweb";
import { resolveContractAbi } from "thirdweb/contract";
import { Heading, Text } from "tw-components";

interface ContractCodePageProps {
  contract: ThirdwebContract;
}

export const ContractExplorerPage: React.FC<ContractCodePageProps> = ({
  contract,
}) => {
  const contractAbiQuery = useQuery({
    queryKey: ["contractAbi", contract],
    queryFn: () => resolveContractAbi(contract),
    enabled: !!contract,
  });
  const functions = useContractFunctions(contractAbiQuery.data || []);
  return (
    <Flex direction="column" h="70vh">
      <Skeleton
        height="100%"
        isLoaded={!!contract && contractAbiQuery.isSuccess}
      >
        {functions && functions.length > 0 ? (
          <ContractFunctionsOverview
            onlyFunctions
            functions={functions}
            contract={contract}
          />
        ) : (
          <Center>
            <Flex direction="column" textAlign="center" gap={2}>
              <Heading as="p" size="label.md">
                No callable functions discovered in ABI.
              </Heading>
              <Text>
                Please note that proxy contracts are not yet supported in the
                explorer, check back soon for full proxy support.
              </Text>
            </Flex>
          </Center>
        )}
      </Skeleton>
    </Flex>
  );
};
