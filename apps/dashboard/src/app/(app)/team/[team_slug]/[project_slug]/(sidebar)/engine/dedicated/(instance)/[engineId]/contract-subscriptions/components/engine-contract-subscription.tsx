"use client";

import { useEngineContractSubscription } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, FormControl, Switch } from "@chakra-ui/react";
import { useId, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { FormLabel, Heading, Text } from "tw-components";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
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
    authToken,
    instanceUrl,
  });

  const autoUpdateId = useId();

  return (
    <Flex flexDir="column" gap={4}>
      <Flex flexDir="row" gap={2} justify="space-between">
        <Flex flexDir="column" gap={2}>
          <Heading size="title.md">Contract Subscriptions</Heading>
          <Text>
            Subscribe to event logs and transaction receipts on any contract.{" "}
            <UnderlineLink
              color="primary.500"
              href="https://portal.thirdweb.com/engine/features/contract-subscriptions"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more about contract subscriptions
            </UnderlineLink>
            .
          </Text>
        </Flex>
        <div className="flex flex-row">
          <FormControl alignItems="center" display="flex">
            <FormLabel htmlFor={autoUpdateId} mb="0">
              Auto-Update
            </FormLabel>
            <Switch
              id={autoUpdateId}
              isChecked={autoUpdate}
              onChange={() => setAutoUpdate((val) => !val)}
            />
          </FormControl>
        </div>
      </Flex>
      <ContractSubscriptionTable
        authToken={authToken}
        autoUpdate={autoUpdate}
        client={client}
        contractSubscriptions={contractSubscriptionsQuery.data ?? []}
        instanceUrl={instanceUrl}
        isFetched={contractSubscriptionsQuery.isFetched}
        isPending={contractSubscriptionsQuery.isPending}
      />
      <AddContractSubscriptionButton
        authToken={authToken}
        client={client}
        instanceUrl={instanceUrl}
      />
    </Flex>
  );
};
