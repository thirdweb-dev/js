import { ApiKey, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { useEmbeddedWallets } from "@3rdweb-sdk/react/hooks/useEmbeddedWallets";
import { Flex, HStack } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { EmbeddedWallets } from "components/embedded-wallets";
import { WalletsSidebar } from "core-ui/sidebar/wallets";
import { PageId } from "page-id";
import { useEffect, useMemo, useState } from "react";
import { Heading, Text, TrackedLink } from "tw-components";

import { ThirdwebNextPage } from "utils/types";
import { NoApiKeys } from "components/settings/ApiKeys/NoApiKeys";
import { ApiKeysMenu } from "components/settings/ApiKeys/Menu";
import { LoggedInOnlyView } from "components/dashboard/LoggedInOnlyView";

const TRACKING_CATEGORY = "embedded-wallet";

const DashboardWalletsEmbedded: ThirdwebNextPage = () => {
  const keysQuery = useApiKeys();

  const [selectedKey, setSelectedKey] = useState<undefined | ApiKey>();
  const walletsQuery = useEmbeddedWallets(selectedKey?.key as string);

  const apiKeys = useMemo(() => {
    return (keysQuery?.data || []).filter((key) => {
      return !!(key.services || []).find(
        (srv) => srv.name === "embeddedWallets",
      );
    });
  }, [keysQuery]);

  const wallets = walletsQuery?.data || [];
  const hasApiKeys = apiKeys.length > 0;

  useEffect(() => {
    if (selectedKey) {
      return;
    }
    if (apiKeys.length > 0) {
      setSelectedKey(apiKeys[0]);
    } else {
      setSelectedKey(undefined);
    }
  }, [apiKeys, selectedKey]);

  return (
    <LoggedInOnlyView>
      <Flex flexDir="column" gap={8}>
        <Flex flexDir="column" gap={2}>
          <Flex
            justifyContent="space-between"
            direction={{ base: "column", lg: "row" }}
            gap={4}
          >
            <Heading size="title.lg" as="h1">
              Embedded Wallets
            </Heading>
            {hasApiKeys && (
              <HStack gap={3}>
                {selectedKey && (
                  <ApiKeysMenu
                    apiKeys={apiKeys}
                    selectedKey={selectedKey}
                    onSelect={setSelectedKey}
                  />
                )}
              </HStack>
            )}
          </Flex>

          <Text maxW="xl">
            A wallet infrastructure that enables apps to create, manage, and
            control their users wallets. Email login, social login, and
            bring-your-own auth supported.{" "}
            <TrackedLink
              isExternal
              href="https://portal.thirdweb.com/embedded-wallet"
              label="learn-more"
              category={TRACKING_CATEGORY}
              color="primary.500"
            >
              Learn more
            </TrackedLink>
          </Text>
        </Flex>

        {!hasApiKeys && <NoApiKeys />}

        {hasApiKeys && selectedKey && (
          <EmbeddedWallets
            apiKey={selectedKey}
            wallets={wallets}
            isLoading={walletsQuery.isLoading}
            isFetched={walletsQuery.isFetched}
            trackingCategory={TRACKING_CATEGORY}
          />
        )}
      </Flex>
    </LoggedInOnlyView>
  );
};

DashboardWalletsEmbedded.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <WalletsSidebar activePage="embedded" />
    {page}
  </AppLayout>
);

DashboardWalletsEmbedded.pageId = PageId.DashboardWalletsEmbedded;

export default DashboardWalletsEmbedded;
