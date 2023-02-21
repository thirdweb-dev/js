import { useAllContractList } from "@3rdweb-sdk/react";
import { ConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  Container,
  Divider,
  Flex,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import { ReleasedContracts } from "components/contract-components/tables/released-contracts";
import { FancyEVMIcon } from "components/icons/Ethereum";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { PageId } from "page-id";
import { useEffect, useState } from "react";
import { Card, Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

/**
 *
 * @TODO
 * Initially the FTUX is shown, then the contracts are shown. This creates a flash of wrong content.
 * To fix this, we need to hold off rendering either the FTUX or the contracts until we know which one to show.
 */

const Contracts: ThirdwebNextPage = () => {
  const address = useAddress();

  /** put the component is loading state for sometime to avoid layout shift */
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, []);

  return (
    <ClientOnly fadeInDuration={600} ssr={null}>
      {!isLoading && (
        <>
          {address ? (
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
                  <EVMContracts address={address} />
                </TabPanel>
                <TabPanel px={0}>
                  <PublishedContractsPage address={address} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <Container maxW="lg">
              <Card p={6} as={Flex} flexDir="column" gap={2}>
                <Heading as="h2" size="title.sm">
                  Please connect your wallet
                </Heading>
                <Text>
                  In order to interact with your contracts you need to connect
                  an EVM compatible wallet.
                </Text>
                <Divider my={4} />
                <ConnectWallet ecosystem="evm" />
              </Card>
            </Container>
          )}
        </>
      )}
    </ClientOnly>
  );
};

Contracts.getLayout = (page, props) => (
  <AppLayout ecosystem="evm" {...props}>
    {page}
  </AppLayout>
);
Contracts.pageId = PageId.Contracts;

export default Contracts;

interface ContractsProps {
  address: string;
}

const EVMContracts: React.FC<ContractsProps> = ({ address }) => {
  const allContractList = useAllContractList(address);
  return (
    <Flex direction="column" gap={8}>
      <DeployedContracts contractListQuery={allContractList} limit={50} />
    </Flex>
  );
};

const PublishedContractsPage: React.FC<ContractsProps> = ({ address }) => {
  return (
    <Flex direction="column" gap={8}>
      {/* this section needs to be on the publishersdk context (polygon SDK) */}
      <PublisherSDKContext>
        <ReleasedContracts address={address} />
      </PublisherSDKContext>
    </Flex>
  );
};
