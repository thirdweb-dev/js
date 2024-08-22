"use client";

import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { Flex } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { EventsFeed } from "./components/events-feed";

interface ContractEventsPageProps {
  contract: ThirdwebContract;
}

export const ContractEventsPage: React.FC<ContractEventsPageProps> = ({
  contract,
}) => {
  useIsomorphicLayoutEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Flex direction="column" gap={6}>
      <EventsFeed contract={contract} />
    </Flex>
  );
};
