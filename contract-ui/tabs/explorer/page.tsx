import { Center, Flex, Skeleton } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { Abi } from "@thirdweb-dev/sdk";
import { useContractFunctions } from "components/contract-components/hooks";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import { Heading, Text } from "tw-components";

interface ContractCodePageProps {
  contractAddress?: string;
}

export const ContractExplorerPage: React.FC<ContractCodePageProps> = ({
  contractAddress,
}) => {
  const { contract } = useContract(contractAddress);

  const functions = useContractFunctions(contract?.abi as Abi);
  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }
  return (
    <Flex direction="column" h="70vh">
      <Skeleton height="100%" isLoaded={!!contract}>
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
