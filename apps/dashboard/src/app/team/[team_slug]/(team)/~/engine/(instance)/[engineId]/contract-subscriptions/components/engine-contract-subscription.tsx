"use client";

import { useEngineContractSubscription } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, FormControl, Switch } from "@chakra-ui/react";
import { useState } from "react";
import { FormLabel, Heading, Text, TrackedLink } from "tw-components";
import { AddContractSubscriptionButton } from "./add-contract-subscription-button";
import { ContractSubscriptionTable } from "./contract-subscriptions-table";

interface EngineContractSubscriptionsProps {
  instanceUrl: string;
  authToken: string;
}

export const EngineContractSubscriptions: React.FC<
  EngineContractSubscriptionsProps
> = ({ instanceUrl, authToken }) => {
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
            <TrackedLink
              href="https://portal.thirdweb.com/engine/features/contract-subscriptions"
              color="primary.500"
              isExternal
              category="engine"
              label="learn-more-contract-subscriptions"
            >
              Learn more about contract subscriptions
            </TrackedLink>
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
      />
      <AddContractSubscriptionButton
        instanceUrl={instanceUrl}
        authToken={authToken}
      />
    </Flex>
  );
};
