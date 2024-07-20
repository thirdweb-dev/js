import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { Notifications } from "components/settings/Account/Notifications";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const SettingsNotificationsPage: ThirdwebNextPage = () => {
  const meQuery = useAccount();

  if (meQuery.isLoading || !meQuery.data) {
    return null;
  }

  const account = meQuery.data;

  return (
    <Flex flexDir="column" gap={8}>
      <Flex direction="column" gap={2}>
        <Heading size="title.lg" as="h1" h={10}>
          Notification Settings
        </Heading>
        <Text size="body.md">
          Configure your email notification preferences.
        </Text>
      </Flex>

      <Notifications account={account} />
    </Flex>
  );
};

SettingsNotificationsPage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="notifications" />

    {page}
  </AppLayout>
);

SettingsNotificationsPage.pageId = PageId.SettingsNotifications;

export default SettingsNotificationsPage;
