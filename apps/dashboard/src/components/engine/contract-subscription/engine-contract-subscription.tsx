import {
  useEngineContractSubscription,
  useEngineSystemHealth,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, FormControl, Icon, Stack, Switch } from "@chakra-ui/react";
import { useState } from "react";
import { IoMdBeaker } from "react-icons/io";
import { Card, FormLabel, Heading, Text, TrackedLink } from "tw-components";
import { AddContractSubscriptionButton } from "./add-contract-subscription-button";
import { ContractSubscriptionTable } from "./contract-subscriptions-table";

interface EngineContractSubscriptionsProps {
  instanceUrl: string;
}

export const EngineContractSubscriptions: React.FC<
  EngineContractSubscriptionsProps
> = ({ instanceUrl }) => {
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const contractSubscriptionsQuery = useEngineContractSubscription(instanceUrl);
  const health = useEngineSystemHealth(instanceUrl);

  const hasFeatureContractSubscriptions = health.data?.features?.includes(
    "CONTRACT_SUBSCRIPTIONS",
  );
  if (!hasFeatureContractSubscriptions) {
    return <EarlyAccess />;
  }

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
        <Flex>
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
        </Flex>
      </Flex>
      <ContractSubscriptionTable
        instanceUrl={instanceUrl}
        contractSubscriptions={contractSubscriptionsQuery.data ?? []}
        isLoading={contractSubscriptionsQuery.isLoading}
        isFetched={contractSubscriptionsQuery.isFetched}
        autoUpdate={autoUpdate}
      />
      <AddContractSubscriptionButton instanceUrl={instanceUrl} />
    </Flex>
  );
};

const EarlyAccess = () => {
  return (
    <Card p={8}>
      <Stack spacing={4}>
        <Flex gap={2} align="center">
          <Icon as={IoMdBeaker} />
          <Heading size="title.xs">
            Contract Subscriptions is in Early Access
          </Heading>
        </Flex>
        <Text>
          Please{" "}
          <TrackedLink
            href="https://thirdweb.com/contact-us"
            isExternal
            color="blue.500"
            category="engine"
            label="contact-us-contract-subscriptions"
          >
            contact us
          </TrackedLink>{" "}
          to enable this feature.
        </Text>
      </Stack>
    </Card>
  );
};
