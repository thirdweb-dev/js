import { ActivityFeed } from "./components/activity-feed";
import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";

interface ContractActivityPageProps {
  contractAddress?: string;
}

export const ContractActivityPage: React.FC<ContractActivityPageProps> = ({
  contractAddress,
}) => {
  const contract = useContract(contractAddress);

  if (contract.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={6}>
      <ActivityFeed contractAddress={contractAddress} />
    </Flex>
  );
};
