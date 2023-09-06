import { AppLayout } from "components/app-layouts/app";
import { Flex, HStack } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { Heading } from "tw-components";
import { Usage } from "components/settings/Account/Usage";
import { BillingPeriod } from "components/settings/Account/BillingPeriod";
import { useAccount, useAccountUsage } from "@3rdweb-sdk/react/hooks/useApi";
import { BillingPlan } from "components/settings/Account/BillingPlan";

const SettingsUsagePage: ThirdwebNextPage = () => {
  const address = useAddress();
  const meQuery = useAccount();
  const usageQuery = useAccountUsage();

  if (!address) {
    return <ConnectWalletPrompt />;
  }

  if (meQuery.isLoading || !meQuery.data) {
    return null;
  }

  const account = meQuery.data;

  return (
    <Flex flexDir="column" gap={8} mt={{ base: 2, md: 6 }}>
      <Flex direction="column">
        <Flex
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          gap={4}
          h={10}
        >
          <Heading size="title.lg" as="h1">
            Usage
          </Heading>
        </Flex>
        <HStack
          justifyContent="space-between"
          flexDir={{ base: "column", lg: "row" }}
          alignItems={{ base: "flex-start", lg: "center" }}
        >
          <BillingPlan account={account} />
          <BillingPeriod account={account} usage={usageQuery.data} />
        </HStack>
      </Flex>

      <Usage usage={usageQuery.data} usageLoading={usageQuery.isLoading} />
    </Flex>
  );
};

SettingsUsagePage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="usage" />

    {page}
  </AppLayout>
);

SettingsUsagePage.pageId = PageId.SettingsUsage;

export default SettingsUsagePage;
