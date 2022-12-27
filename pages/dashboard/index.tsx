import { useAllContractList, useAllProgramsList } from "@3rdweb-sdk/react";
import {
  Flex,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAddress } from "@thirdweb-dev/react";
import { FTUX } from "components/FTUX/FTUX";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import { DeployedPrograms } from "components/contract-components/tables/deployed-programs";
import { ReleasedContracts } from "components/contract-components/tables/released-contracts";
import { FancyEVMIcon } from "components/icons/Ethereum";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { utils } from "ethers";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { isPossibleSolanaAddress } from "lib/address-utils";
import { PageId } from "page-id";
import { useMemo } from "react";
import { Heading } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

/**
 *
 * @TODO
 * Initially the FTUX is shown, then the dashboard is shown. This creates a flash of wrong content.
 * To fix this, we need to hold off rendering either the FTUX or the dashboard until we know which one to show.
 */

const Dashboard: ThirdwebNextPage = () => {
  const queryParam = useSingleQueryParam("address") || "dashboard";
  const address = useAddress();
  const { publicKey } = useWallet();

  const evmAddress = useMemo(() => {
    return queryParam === "dashboard"
      ? address
      : utils.isAddress(queryParam)
      ? queryParam
      : address;
  }, [address, queryParam]);

  const solAddress = useMemo(() => {
    return queryParam === "dashboard"
      ? publicKey?.toBase58()
      : isPossibleSolanaAddress(queryParam)
      ? queryParam
      : publicKey?.toBase58();
  }, [publicKey, queryParam]);

  return (
    <>
      {solAddress && <SOLDashboard address={solAddress} />}
      {evmAddress && (
        <Tabs isLazy lazyBehavior="keepMounted">
          <TabList
            px={0}
            borderBottomColor="borderColor"
            borderBottomWidth="1px"
            overflowX={{ base: "auto", md: "inherit" }}
          >
            <Tab gap={2} _selected={{ borderBottomColor: "purple.500" }}>
              <Icon opacity={0.85} boxSize={6} as={FancyEVMIcon} />
              <Heading size="label.lg">Deployed Contracts</Heading>
            </Tab>
            <Tab
              gap={2}
              _selected={{
                borderBottomColor: "#FBFF5C",
              }}
            >
              <ChakraNextImage
                src={require("public/assets/product-icons/release.png")}
                alt=""
                boxSize={6}
              />
              <Heading size="label.lg">Released Contracts</Heading>
            </Tab>
          </TabList>
          <TabPanels px={0} py={2}>
            <TabPanel px={0}>
              <EVMDashboard address={evmAddress} />
            </TabPanel>
            <TabPanel px={0}>
              <ReleaseDashboard address={evmAddress} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
      {!evmAddress && !solAddress && <FTUX />}
    </>
  );
};

// const AppLayout = dynamic(
//   async () => (await import("components/app-layouts/app")).AppLayout,
// );

Dashboard.getLayout = (page, props) => <AppLayout {...props}>{page}</AppLayout>;
Dashboard.pageId = PageId.Dashboard;

export default Dashboard;

interface DashboardProps {
  address: string;
}

const EVMDashboard: React.FC<DashboardProps> = ({ address }) => {
  const allContractList = useAllContractList(address);
  return (
    <Flex direction="column" gap={8}>
      <DeployedContracts contractListQuery={allContractList} limit={50} />
    </Flex>
  );
};

const ReleaseDashboard: React.FC<DashboardProps> = ({ address }) => {
  return (
    <Flex direction="column" gap={8}>
      {/* this section needs to be on the publishersdk context (polygon SDK) */}
      <PublisherSDKContext>
        <ReleasedContracts address={address} />
      </PublisherSDKContext>
    </Flex>
  );
};

const SOLDashboard: React.FC<DashboardProps> = ({ address }) => {
  const allProgramAccounts = useAllProgramsList(address);

  return (
    <Flex direction="column" gap={8}>
      <DeployedPrograms programListQuery={allProgramAccounts} />
    </Flex>
  );
};
