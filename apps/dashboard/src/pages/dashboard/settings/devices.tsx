import { useAuthorizedWallets } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { AuthorizedWalletsTable } from "components/settings/AuthorizedWallets/AuthorizedWalletsTable";
import { SettingsSidebarLayout } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const SettingsDevicesPage: ThirdwebNextPage = () => {
  const authorizedWalletsQuery = useAuthorizedWallets();

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
  <AppLayout
    {...props}
    pageContainerClassName="!max-w-full !px-0"
    mainClassName="!pt-0"
  >
    <SettingsSidebarLayout>{page}</SettingsSidebarLayout>
  </AppLayout>
);

SettingsDevicesPage.pageId = PageId.SettingsDevices;

export default SettingsDevicesPage;
