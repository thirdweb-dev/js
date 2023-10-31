import { useAccount, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ApiKeyTable } from "components/settings/ApiKeyTable";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeyTable/Alerts";
import { CreateApiKeyButton } from "components/settings/ApiKeyTable/CreateButton";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { useMemo } from "react";
import { Heading, Link, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";
import { SERVICES } from "@thirdweb-dev/service-utils";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";

const SettingsApiKeysPage: ThirdwebNextPage = () => {
  const { isLoggedIn } = useLoggedInUser();
  const keysQuery = useApiKeys();
  const meQuery = useAccount();

  const account = meQuery?.data;
  const apiKeys = keysQuery?.data;

  const hasSmartWalletsWithoutBilling = useMemo(() => {
    if (!account || !apiKeys) {
      return;
    }

    return apiKeys.find(
      (k) =>
        k.services?.find(
          (s) => account.status !== "validPayment" && s.name === "bundler",
        ),
    );
  }, [apiKeys, account]);

  if (!isLoggedIn) {
    return <ConnectWalletPrompt />;
  }

  return (
    <Flex flexDir="column" gap={8} mt={{ base: 2, md: 6 }}>
      <Flex direction="column" gap={2}>
        <Flex
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <Heading size="title.lg" as="h1">
            API Keys
          </Heading>
          <CreateApiKeyButton
            enabledServices={SERVICES.map((srv) => srv.name)}
          />
        </Flex>

        <Text>
          An API key is required to use thirdweb&apos;s services through the SDK
          and CLI. {` `}
          <Link
            target="_blank"
            color="blue.500"
            href="https://portal.thirdweb.com/api-keys"
            isExternal
          >
            Learn more
          </Link>
        </Text>
      </Flex>

      {hasSmartWalletsWithoutBilling && (
        <SmartWalletsBillingAlert dismissable />
      )}

      <ApiKeyTable
        keys={apiKeys || []}
        isLoading={keysQuery.isLoading}
        isFetched={keysQuery.isFetched}
      />
    </Flex>
  );
};

SettingsApiKeysPage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="apiKeys" />
    {page}
  </AppLayout>
);

SettingsApiKeysPage.pageId = PageId.SettingsApiKeys;

export default SettingsApiKeysPage;
