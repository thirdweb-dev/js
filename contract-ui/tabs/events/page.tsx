import { EventsFeed } from "./components/events-feed";
import { Flex } from "@chakra-ui/react";

interface ContractEventsPageProps {
  contractAddress?: string;
}

export const ContractEventsPage: React.FC<ContractEventsPageProps> = ({
  contractAddress,
}) => {
  if (!contractAddress) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={6}>
      <EventsFeed contractAddress={contractAddress} />
    </Flex>
  );
};
