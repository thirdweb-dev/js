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
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { NoWallet } from "components/contract-components/shared/no-wallet";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import { DeployedPrograms } from "components/contract-components/tables/deployed-programs";
import { ReleasedContracts } from "components/contract-components/tables/released-contracts";
import { FancyEVMIcon } from "components/icons/Ethereum";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { utils } from "ethers";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { isPossibleSolanaAddress } from "lib/address-utils";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import * as React from "react";
import { ReactElement, useMemo } from "react";
import { Heading } from "tw-components";

const Dashboard: ThirdwebNextPage = () => {
  const wallet = useSingleQueryParam("address") || "dashboard";
  const address = useAddress();
  const { publicKey } = useWallet();

  const evmAddress = useMemo(() => {
    return wallet === "dashboard"
      ? address
      : utils.isAddress(wallet)
      ? wallet
      : address;
  }, [address, wallet]);

  const solAddress = useMemo(() => {
    return wallet === "dashboard"
      ? publicKey?.toBase58()
      : isPossibleSolanaAddress(wallet)
      ? wallet
      : publicKey?.toBase58();
  }, [publicKey, wallet]);

  if (solAddress) {
    return <SOLDashboard address={solAddress} />;
  }

  if (evmAddress) {
    return (
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
    );
  }
  return <NoWallet />;
};

Dashboard.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
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
