import {
  AccountStatus,
  useAccount,
  useApiKeys,
} from "@3rdweb-sdk/react/hooks/useApi";
import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ApiKeys } from "components/settings/ApiKeys";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeys/Alerts";
import { CreateApiKeyButton } from "components/settings/ApiKeys/Create";
import { SettingsSidebarLayout } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { useMemo } from "react";
import { Link } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const SettingsApiKeysPage: ThirdwebNextPage = () => {
  const keysQuery = useApiKeys();
  const meQuery = useAccount();

  const account = meQuery?.data;
  const apiKeys = keysQuery?.data;

  const hasSmartWalletsWithoutBilling = useMemo(() => {
    if (!account || !apiKeys) {
      return;
    }

    return apiKeys.find((k) =>
      k.services?.find(
        (s) =>
          account.status !== AccountStatus.ValidPayment && s.name === "bundler",
      ),
    );
  }, [apiKeys, account]);

  return (
    <Flex flexDir="column" gap={8}>
      <Flex direction="column" gap={2}>
        <Flex
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <h1 className="text-3xl font-semibold tracking-tight">API Keys</h1>
          <CreateApiKeyButton />
        </Flex>

        <p className="text-muted-foreground text-sm">
          An API key is required to use thirdweb&apos;s services through the SDK
          and CLI.{" "}
          <Link
            target="_blank"
            color="blue.500"
            href="https://portal.thirdweb.com/account/api-keys"
            isExternal
          >
            Learn more
          </Link>
        </p>
      </Flex>

      {hasSmartWalletsWithoutBilling && (
        <SmartWalletsBillingAlert dismissable />
      )}

      <ApiKeys
        keys={apiKeys || []}
        isLoading={keysQuery.isLoading}
        isFetched={keysQuery.isFetched}
      />
    </Flex>
  );
};

SettingsApiKeysPage.getLayout = (page, props) => (
  <AppLayout
    {...props}
    pageContainerClassName="!max-w-full !px-0"
    mainClassName="!pt-0"
  >
    <SettingsSidebarLayout>{page}</SettingsSidebarLayout>
  </AppLayout>
);

SettingsApiKeysPage.pageId = PageId.SettingsApiKeys;

export default SettingsApiKeysPage;
