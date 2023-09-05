import { Flex, SimpleGrid } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { WalletsSidebar } from "core-ui/sidebar/wallets";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { Heading } from "tw-components";
import { NavigationCard } from "components/dashboard/NavigationCard";

const TRACKING_CATEGORY = "dashboard-wallets";

const CONNECT_SECTION = [
  {
    title: "Connect Wallet",
    description:
      "Powerful UI component that enables you to integrate wallets into your app.",
    image: require("public/assets/dashboard/wallets/connect-wallet.png"),
    href: "/dashboard/wallets/connect",
  },
  {
    title: "Wallet SDK",
    description:
      "Hooks and helper functions that let you easily work with wallets in your app.",
    image: require("public/assets/dashboard/wallets/wallet-sdk.png"),
    href: "/dashboard/wallets/wallet-sdk",
  },
];

const CREATE_SECTION = [
  {
    title: "Smart Wallet",
    description:
      "Integrate Account abstraction (ERC-4337) compliant smart accounts into your apps.",
    image: require("public/assets/dashboard/wallets/smart-wallet.png"),
    href: "/dashboard/wallets/smart-wallet",
  },
  {
    title: "Email Wallet",
    description:
      "Enable seamless onboarding experiences with instant email-based wallets.",
    image: require("public/assets/dashboard/wallets/email-wallet.png"),
    href: "https://portal.thirdweb.com/wallet/paper",
  },
];

const DashboardWallets: ThirdwebNextPage = () => {
  return (
    <Flex
      flexDir="column"
      gap={12}
      mt={{ base: 2, md: 6 }}
      w={{ base: "100%", xl: "70%" }}
    >
      <Flex flexDir="column" gap={4}>
        <Heading size="title.md">Connect</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {CONNECT_SECTION.map(({ title, description, image, href }) => (
            <NavigationCard
              key={title}
              title={title}
              description={description}
              image={image}
              href={href}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
            />
          ))}
        </SimpleGrid>
      </Flex>
      <Flex flexDir="column" gap={4}>
        <Heading size="title.md">Create</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {CREATE_SECTION.map(({ title, description, image, href }) => (
            <NavigationCard
              key={title}
              title={title}
              description={description}
              image={image}
              href={href}
              TRACKING_CATEGORY={TRACKING_CATEGORY}
            />
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};

DashboardWallets.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <WalletsSidebar activePage="smart-wallet" />
    {page}
  </AppLayout>
);

DashboardWallets.pageId = PageId.DashboardWallets;

export default DashboardWallets;
