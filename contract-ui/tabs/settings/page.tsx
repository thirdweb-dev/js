import { Box, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { Heading } from "tw-components";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

export const CustomContractSettingsTab: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const contractQuery = useContract(contractAddress);

  if (!contractQuery || contractQuery?.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={4}>
      <Flex gap={8} w="100%">
        <Heading>Settings page</Heading>
        <Box minH="200vh"></Box>
      </Flex>
    </Flex>
  );
};
