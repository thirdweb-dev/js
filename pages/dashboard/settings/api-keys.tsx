import { useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { ApiKeyTable } from "components/settings/ApiKeyTable";
import { CreateApiKeyButton } from "components/settings/ApiKeyTable/CreateButton";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { Heading, Link, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const SettingsApiKeysPage: ThirdwebNextPage = () => {
  const address = useAddress();
  const keysQuery = useApiKeys();

  const apiKeys = keysQuery?.data;

  if (!address) {
    return <ConnectWalletPrompt />;
  }

  return (
    <Flex flexDir="column" gap={8} mt={{ base: 2, md: 6 }}>
      <Flex direction="column" gap={2}>
        <Flex
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          gap={4}
          h={10}
        >
          <Heading size="title.lg" as="h1">
            API Keys
          </Heading>
          <CreateApiKeyButton />
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
