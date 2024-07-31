import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, Stack } from "@chakra-ui/react";
import { SidebarNav } from "core-ui/sidebar/nav";
import type { Route } from "core-ui/sidebar/types";
import { useTrack } from "hooks/analytics/useTrack";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
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
import { EngineSystemMetrics } from "./system-metrics";

interface EngineNavigationProps {
  instance: EngineInstance;
  setConnectedInstance: Dispatch<SetStateAction<EngineInstance | undefined>>;
}

export const EngineNavigation: React.FC<EngineNavigationProps> = ({
  instance,
  setConnectedInstance,
}) => {
  const trackEvent = useTrack();

  const onClickBack = () => {
    setConnectedInstance(undefined);
  };

  const [activePage, setActivePage] = useState<string>("overview");

  const handleClick = useCallback(
    (id: string) => {
      trackEvent({
        category: "engine",
        action: "navigate-tab",
        label: id,
        url: instance.url,
      });
      setActivePage(id);
    },
    [instance.url, trackEvent],
  );

  const links = useMemo(
    () =>
      [
        {
          path: "/dashboard/engine/overview",
          title: "Overview",
          name: "overview",
          onClick: () => handleClick("overview"),
        },
        {
          path: "/dashboard/engine/explorer",
          title: "Explorer",
          name: "explorer",
          onClick: () => handleClick("explorer"),
        },
        {
          path: "/dashboard/engine/relayers",
          title: "Relayers",
          name: "relayers",
          onClick: () => handleClick("relayers"),
        },
        {
          path: "/dashboard/engine/contract-subscriptions",
          title: "Contract Subscriptions",
          name: "contract-subscriptions",
          onClick: () => handleClick("contract-subscriptions"),
        },
        {
          path: "/dashboard/engine/admins",
          title: "Admins",
          name: "admins",
          onClick: () => handleClick("admins"),
        },
        {
          path: "/dashboard/engine/access-tokens",
          title: "Access Tokens",
          name: "access-tokens",
          onClick: () => handleClick("access-tokens"),
        },
        {
          path: "/dashboard/engine/webhooks",
          title: "Webhooks",
          name: "webhooks",
          onClick: () => handleClick("webhooks"),
        },
        {
          path: "/dashboard/engine/configuration",
          title: "Configuration",
          name: "configuration",
          onClick: () => handleClick("configuration"),
        },
        {
          path: "/dashboard/engine/metrics",
          title: "Metrics",
          name: "metrics",
          onClick: () => handleClick("metrics"),
        },
      ] satisfies Route[],
    [handleClick],
  );

  const activeComponent = useMemo(() => {
    const tabs = {
      overview: <EngineOverview instanceUrl={instance.url} />,
      explorer: <EngineExplorer instanceUrl={instance.url} />,
      relayers: <EngineRelayer instanceUrl={instance.url} />,
      "contract-subscriptions": (
        <EngineContractSubscriptions instanceUrl={instance.url} />
      ),
      admins: <EngineAdmins instanceUrl={instance.url} />,
      "access-tokens": <EngineAccessTokens instanceUrl={instance.url} />,
      webhooks: <EngineWebhooks instanceUrl={instance.url} />,
      configuration: <EngineConfiguration instance={instance} />,
      metrics: <EngineSystemMetrics instance={instance} />,
    };
    return tabs[activePage as keyof typeof tabs];
  }, [instance, activePage]);

  return (
    <>
      <SidebarNav links={links} activePage={activePage} title="Engine" />
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

        {activeComponent}
      </Stack>
    </>
  );
};
