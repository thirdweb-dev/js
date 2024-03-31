import { EventsFeed } from "./components/events-feed";
import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";

interface ContractEventsPageProps {
  contractAddress?: string;
}

export const ContractEventsPage: React.FC<ContractEventsPageProps> = ({
  contractAddress,
}) => {
  useEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
