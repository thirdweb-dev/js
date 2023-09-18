import { Flex } from "@chakra-ui/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { dashboardSupportedWallets } from "components/app-layouts/providers";
import { ConnectWalletWithPreview } from "components/wallets/ConnectWalletWithPreview";
import { WalletsSidebar } from "core-ui/sidebar/wallets";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { Heading, Text, Link } from "tw-components";

const DashboardWalletsConnect: ThirdwebNextPage = () => {
  return (
    <Flex flexDir="column" gap={16} mt={{ base: 2, md: 6 }}>
      <ThirdwebProvider
        activeChain="goerli"
        supportedWallets={dashboardSupportedWallets}
      >
        <Flex flexDir="column" gap={4}>
          <Heading size="title.lg" as="h1">
            Connect Wallet
          </Heading>
          <Text>
            Fully customizable{" "}
            <Link
              href="https://portal.thirdweb.com/react/react.connectwallet"
              color="blue.400"
              isExternal
            >
              component
            </Link>{" "}
            to connect wallets in your React, React Native and Unity apps.
          </Text>
          <ConnectWalletWithPreview />
        </Flex>
      </ThirdwebProvider>
    </Flex>
  );
};

DashboardWalletsConnect.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <WalletsSidebar activePage="connect" />
    {page}
  </AppLayout>
);

DashboardWalletsConnect.pageId = PageId.DashboardWalletsConnect;

export default DashboardWalletsConnect;
