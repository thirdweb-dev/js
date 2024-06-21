import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import type { Dispatch, SetStateAction } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Button, Heading, Text } from "tw-components";
import { EngineVersionBadge } from "./badges/version";
import { EngineConfiguration } from "./configuration/engine-configuration";
import { EngineWebhooks } from "./configuration/engine-webhooks";
import { EngineContractSubscriptions } from "./contract-subscription/engine-contract-subscription";
import { EngineExplorer } from "./explorer/engine-explorer";
import { EngineOverview } from "./overview/engine-overview";
import { EngineAccessTokens } from "./permissions/engine-access-tokens";
import { EngineAdmins } from "./permissions/engine-admins";
import { EngineRelayer } from "./relayer/engine-relayer";

interface EngineNavigationProps {
  instance: EngineInstance;
  setConnectedInstance: Dispatch<SetStateAction<EngineInstance | undefined>>;
}

export const EngineNavigation: React.FC<EngineNavigationProps> = ({
  instance,
  setConnectedInstance,
}) => {
  const tabs = [
    {
      title: "Overview",
      children: <EngineOverview instanceUrl={instance.url} />,
    },
    {
      title: "Explorer",
      children: <EngineExplorer instanceUrl={instance.url} />,
    },
    {
      title: "Relayers",
      children: <EngineRelayer instanceUrl={instance.url} />,
    },
    {
      title: "Contract Subscriptions",
      children: <EngineContractSubscriptions instanceUrl={instance.url} />,
    },
    {
      title: "Admins",
      children: <EngineAdmins instanceUrl={instance.url} />,
    },
    {
      title: "Access Tokens",
      children: <EngineAccessTokens instanceUrl={instance.url} />,
    },
    {
      title: "Webhooks",
      children: <EngineWebhooks instanceUrl={instance.url} />,
    },
    {
      title: "Configuration",
      children: <EngineConfiguration instance={instance} />,
    },
  ];

  const trackEvent = useTrack();

  const onClickBack = () => {
    setConnectedInstance(undefined);
  };

  return (
    <Stack spacing={4}>
      <Button
        onClick={onClickBack}
        variant="link"
        leftIcon={<FiArrowLeft />}
        w="fit-content"
      >
        Back
      </Button>

      <Stack>
        <Heading size="title.lg" as="h1" isTruncated>
          {instance.name}
        </Heading>

        <Flex gap={3} alignItems="center">
          {!instance.name.startsWith("https://") && (
            <Text color="gray.600">{instance.url}</Text>
          )}
          <EngineVersionBadge instance={instance} />
        </Flex>
      </Stack>

      <Tabs
        size="sm"
        onChange={(index) => {
          trackEvent({
            category: "engine",
            action: "navigate-tab",
            label: tabs[index].title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            url: instance.url,
          });
        }}
      >
        <TabList>
          {tabs.map((tb) => (
            <Tab key={tb.title} fontSize="small" py={2}>
              {tb.title}
            </Tab>
          ))}
        </TabList>

        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />

        <TabPanels>
          {tabs.map((tb) => (
            <TabPanel key={tb.title} py={8}>
              {tb.children}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Stack>
  );
};
