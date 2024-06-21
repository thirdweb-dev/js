import { useAccount, useAccountUsage } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Flex, HStack } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { BillingPeriod } from "components/settings/Account/Billing/Period";
import { BillingPlan } from "components/settings/Account/Billing/Plan";
import { Usage } from "components/settings/Account/Usage";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { PageId } from "page-id";
import { Heading } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const SettingsUsagePage: ThirdwebNextPage = () => {
  const { isLoggedIn } = useLoggedInUser();
  const meQuery = useAccount();
  const usageQuery = useAccountUsage();

  if (!isLoggedIn) {
    return <ConnectWalletPrompt description="view usage analytics" />;
  }

  if (meQuery.isLoading || !meQuery.data) {
    return null;
  }

  const account = meQuery.data;

  return (
    <Flex flexDir="column" gap={8}>
      <Flex direction="column">
        <Heading size="title.lg" as="h1">
          Usage
        </Heading>
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
