import { useAllContractList } from "@3rdweb-sdk/react";
import { Center, Flex, Spinner } from "@chakra-ui/react";
import {
  ContractWithMetadata,
  FeatureName,
  useAddress,
} from "@thirdweb-dev/react";
import { PaymentContractsTable } from "./payment-contracts-table";
import { Text } from "tw-components";
import {
  paymentsExtensions,
  validPaymentsChainIds,
} from "@3rdweb-sdk/react/hooks/usePayments";
import { useEffect, useState } from "react";

export const PaymentContracts = () => {
  const address = useAddress();
  const deployedContracts = useAllContractList(address);
  const [filteredContracts, setFilteredContracts] = useState<
    ContractWithMetadata[]
  >([]);
  const [isFilteringLoading, setIsFilteringLoading] = useState(true);

  useEffect(() => {
    const filterContractsAsync = async (contracts: ContractWithMetadata[]) => {
      setIsFilteringLoading(true);

      if (contracts.length === 0) {
        setIsFilteringLoading(false);
        return [];
      }

      const filtered = await contracts.reduce(
        async (accumulatedFilteredPromise, contract) => {
          const accumulatedFiltered = await accumulatedFilteredPromise;

          if (!validPaymentsChainIds.includes(contract.chainId)) {
            return accumulatedFiltered;
          }

          const extensions: FeatureName[] = contract.extensions
            ? ((await contract.extensions()) as FeatureName[])
            : [];

          const hasEnabledExtension = extensions.some((extension) =>
            paymentsExtensions.includes(extension),
          );

          if (hasEnabledExtension) {
            accumulatedFiltered.push(contract as never);
          }

          return accumulatedFiltered;
        },
        Promise.resolve([]),
      );
      setIsFilteringLoading(false);
      return filtered;
    };

    if (deployedContracts?.data.length > 0) {
      filterContractsAsync(deployedContracts.data).then(setFilteredContracts);
    }
  }, [deployedContracts?.data]);

  return (
    <Flex flexDir="column" gap={3}>
      {isFilteringLoading && filteredContracts.length === 0 ? (
        <Center>
          <Flex py={8} direction="row" gap={4} align="center">
            <Spinner size="sm" />
            <Text>Loading contracts</Text>
          </Flex>
        </Center>
      ) : (
        <PaymentContractsTable
          paymentContracts={filteredContracts}
          isLoading={deployedContracts.isLoading}
          isFetched={deployedContracts.isFetched}
        />
      )}
    </Flex>
  );
};
