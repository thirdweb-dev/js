"use client";

import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { Flex } from "@chakra-ui/react";
import { EventsFeed } from "./components/events-feed";

interface ContractEventsPageProps {
  contractAddress?: string;
}

export const ContractEventsPage: React.FC<ContractEventsPageProps> = ({
  contractAddress,
}) => {
  useIsomorphicLayoutEffect(() => {
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
