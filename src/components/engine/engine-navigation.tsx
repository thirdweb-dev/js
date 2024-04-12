import { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { Box, ButtonGroup, Divider, Flex, Stack } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Button, Heading, Text } from "tw-components";
import { EngineVersionBadge } from "./badges/version";
import { EngineConfiguration } from "./configuration/engine-configuration";
import { EngineWebhooks } from "./configuration/engine-webhooks";
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
      children: <EngineConfiguration instanceUrl={instance.url} />,
    },
  ];

  const [tab, setTab] = useState(tabs[0].title);
  const trackEvent = useTrack();

  useEffect(() => {
    if (instance) {
      trackEvent({
        category: "engine",
        action: "navigate-tab",
        label: tab.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        url: instance.url,
      });
    }
  }, [instance, tab, trackEvent]);

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

      <Flex flexDir="column" gap={{ base: 0, md: 4 }} mb={4} mt={4}>
        <Box w="full" overflowX="auto" pb={{ base: 4, md: 0 }}>
          <ButtonGroup size="sm" variant="ghost" spacing={2}>
            {tabs.map((tb) => (
              <Button
                key={tb.title}
                type="button"
                isActive={tab === tb.title}
                _active={{
                  bg: "bgBlack",
                  color: "bgWhite",
                }}
                rounded="lg"
                onClick={() => setTab(tb.title)}
              >
                {tb.title}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        <Divider />
      </Flex>

      {tabs.find((t) => t.title === tab)?.children}
    </Stack>
  );
};
