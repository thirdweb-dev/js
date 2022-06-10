import { AddToDashboardCard } from "./cards/add-to-dashboard";
import { CustomContractCode } from "./cards/custom-contract-code";
import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

export const CustomContractOverviewPage: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const contractQuery = useContract(contractAddress);

  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }
  if (!contractQuery || contractQuery?.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={4}>
      <Flex gap={8} w="100%" flexWrap="wrap">
        <AddToDashboardCard contractAddress={contractAddress} />
        <CustomContractCode contractAddress={contractAddress} />
      </Flex>
    </Flex>
  );
};
