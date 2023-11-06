import { EmbeddedWalletUser } from "@3rdweb-sdk/react/hooks/useEmbeddedWallets";
import { TabList, Tabs, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { Users } from "./Users";
import { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { Configure } from "./Configure";

interface EmbeddedWalletsProps {
  apiKey: ApiKey;
  wallets: EmbeddedWalletUser[];
  isLoading: boolean;
  isFetched: boolean;
  trackingCategory: string;
}

export const EmbeddedWallets: React.FC<EmbeddedWalletsProps> = ({
  apiKey,
  wallets,
  isLoading,
  isFetched,
  trackingCategory,
}) => {
  return (
    <Tabs>
      <TabList px={0} borderBottomColor="borderColor" borderBottomWidth="1px">
        <Tab>Users</Tab>
        {/* <Tab>Integrate</Tab> */}
        <Tab>Configuration</Tab>
      </TabList>

      <TabPanels pt={6}>
        <TabPanel px={0}>
          <Users
            wallets={wallets}
            isLoading={isLoading}
            isFetched={isFetched}
            trackingCategory={trackingCategory}
          />
        </TabPanel>
        {/* <TabPanel px={0}></TabPanel> */}
        <TabPanel px={0}>
          <Configure apiKey={apiKey} trackingCategory={trackingCategory} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
