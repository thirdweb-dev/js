import { TabList, Tabs, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { AccountFactories } from "./AccountFactories";
import { SponsorshipPolicies } from "./SponsorshipPolicies";

interface SmartWalletsProps {
  apiKey: ApiKey;
  trackingCategory: string;
  defaultTabIndex?: number;
}

export const SmartWallets: React.FC<SmartWalletsProps> = ({
  apiKey,
  trackingCategory,
  defaultTabIndex,
}) => {
  return (
    <Tabs defaultIndex={defaultTabIndex || 0}>
      <TabList px={0} borderBottomColor="borderColor" borderBottomWidth="1px">
        <Tab>Account Factories</Tab>
        <Tab>Configuration</Tab>
      </TabList>

      <TabPanels pt={6}>
        <TabPanel px={0}>
          <AccountFactories trackingCategory={trackingCategory} />
        </TabPanel>
        <TabPanel px={0}>
          <SponsorshipPolicies
            apiKey={apiKey}
            trackingCategory={trackingCategory}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
