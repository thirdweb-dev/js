import { ConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { useAuthorizedWallets } from "@3rdweb-sdk/react/hooks/useApi";
import { Container, Divider, Flex } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { AuthorizedWalletsTable } from "components/settings/AuthorizedWallets/AuthorizedWalletsTable";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { Card, Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const SettingsAccountPage: ThirdwebNextPage = () => {
  const address = useAddress();
  const authorizedWalletsQuery = useAuthorizedWallets();

  if (!address) {
    return (
      <Container maxW="lg">
        <Card p={6} as={Flex} flexDir="column" gap={2}>
          <Heading as="h2" size="title.sm">
            Connect your wallet to get started
          </Heading>
          <Text>
            In order to manage your account, you need to sign-in with a wallet.
          </Text>
          <Divider my={4} />
          <ConnectWallet ecosystem="evm" />
        </Card>
      </Container>
    );
  }

  return (
    <Flex flexDir="column" gap={8} mt={{ base: 2, md: 6 }}>
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
            Devices authorized to perform actions linked to this account
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

SettingsAccountPage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="account" />

    {page}
  </AppLayout>
);

SettingsAccountPage.pageId = PageId.SettingsAccount;

export default SettingsAccountPage;
