import { useAuthorizedWallets } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { AuthorizedWalletsTable } from "components/settings/AuthorizedWallets/AuthorizedWalletsTable";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const SettingsDevicesPage: ThirdwebNextPage = () => {
  const { isLoggedIn } = useLoggedInUser();
  const authorizedWalletsQuery = useAuthorizedWallets();

  if (!isLoggedIn) {
    return <ConnectWalletPrompt description="view your authorized devices" />;
  }

  return (
    <Flex flexDir="column" gap={8}>
      <Flex direction="column" gap={2}>
        <Flex
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          gap={4}
          flexDirection="column"
        >
          <Heading size="title.lg" as="h1">
            Authorized Devices
          </Heading>
          <Text>
            List of authorized devices that can perform actions on behalf of
            your account.
          </Text>
          <AuthorizedWalletsTable
            authorizedWallets={authorizedWalletsQuery.data || []}
            isLoading={authorizedWalletsQuery.isLoading}
            isFetched={authorizedWalletsQuery.isFetched}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

SettingsDevicesPage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="devices" />

    {page}
  </AppLayout>
);

SettingsDevicesPage.pageId = PageId.SettingsDevices;

export default SettingsDevicesPage;
