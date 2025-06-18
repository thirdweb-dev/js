"use client";

import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { useEngineContractSubscription } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, FormControl, Switch } from "@chakra-ui/react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { FormLabel, Heading, Text } from "tw-components";
import { AddContractSubscriptionButton } from "./add-contract-subscription-button";
import { ContractSubscriptionTable } from "./contract-subscriptions-table";
interface EngineContractSubscriptionsProps {
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}

export const EngineContractSubscriptions: React.FC<
  EngineContractSubscriptionsProps
> = ({ instanceUrl, authToken, client }) => {
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const contractSubscriptionsQuery = useEngineContractSubscription({
    instanceUrl,
    authToken,
  });

  return (
    <Flex flexDir="column" gap={4}>
      <Flex flexDir="row" gap={2} justify="space-between">
        <Flex flexDir="column" gap={2}>
          <Heading size="title.md">Contract Subscriptions</Heading>
          <Text>
            Subscribe to event logs and transaction receipts on any contract.{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/engine/features/contract-subscriptions"
              color="primary.500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about contract subscriptions
            </UnderlineLink>
            .
          </Text>
        </Flex>
        <div className="flex flex-row">
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="auto-update" mb="0">
              Auto-Update
            </FormLabel>
            <Switch
              isChecked={autoUpdate}
              onChange={() => setAutoUpdate((val) => !val)}
              id="auto-update"
            />
          </FormControl>
        </div>
      </Flex>
      <ContractSubscriptionTable
        instanceUrl={instanceUrl}
        contractSubscriptions={contractSubscriptionsQuery.data ?? []}
        isPending={contractSubscriptionsQuery.isPending}
        isFetched={contractSubscriptionsQuery.isFetched}
        autoUpdate={autoUpdate}
        authToken={authToken}
        client={client}
      />
      <AddContractSubscriptionButton
        instanceUrl={instanceUrl}
        authToken={authToken}
        client={client}
      />
    </Flex>
  );
};
