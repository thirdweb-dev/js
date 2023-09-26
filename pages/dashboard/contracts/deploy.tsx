import { useAllContractList } from "@3rdweb-sdk/react";
import { ConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  Box,
  Flex,
  Icon,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { ImportModal } from "components/contract-components/import-contract/modal";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import { StepsCard } from "components/dashboard/StepsCard";
import { ContractsSidebar } from "core-ui/sidebar/contracts";
import { useTrack } from "hooks/analytics/useTrack";
import Image from "next/image";
import { PageId } from "page-id";
import { useMemo } from "react";
import { FiChevronsRight } from "react-icons/fi";
import { Card, Heading, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

type ContentItem = {
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
};

type Content = {
  [key: string]: ContentItem;
};

const TRACKING_CATEGORY = "your_contracts";

interface CardContentProps {
  tab: string;
  value: ContentItem;
}

const CardContent: React.FC<CardContentProps> = ({ tab, value }) => (
  <>
    <Box mb="auto">
      <Flex alignItems="center">
        <Image
          width={32}
          height={32}
          alt=""
          src={`/assets/dashboard/contracts/${tab}.${
            tab === "import" ? "svg" : "png"
          }`}
        />
        <Heading ml={2} size="label.lg" as="h4" fontWeight="bold">
          {value.title}
        </Heading>
      </Flex>
      <Text mt={3}>{value.description}</Text>
    </Box>

    <Icon flexShrink={0} as={FiChevronsRight} boxSize={6} />
  </>
);

const DeployOptions = () => {
  const modalState = useDisclosure();
  const trackEvent = useTrack();

  const content: Content = useMemo(
    () => ({
      explore: {
        title: "Ready-to-deploy",
        description:
          "Pick from our library of ready-to-deploy contracts and deploy to any EVM chain in just 1-click.",
        href: "/explore",
      },
      import: {
        title: "Import",
        description:
          "Import an already deployed contract to build apps on top of contract using thirdweb tools..",
        onClick: modalState.onOpen,
      },
      build: {
        title: "Build your own",
        description:
          "Get started with the Solidity SDK to create custom contracts specific to your use case.",
        href: "/build",
      },
      deploy: {
        title: "Deploy from source",
        description:
          "Deploy your contract by using our interactive CLI. (Supports Hardhat, Forge, Truffle, and more)",
        href: "https://portal.thirdweb.com/cli",
      },
    }),
    [modalState.onOpen],
  );

  return (
    <>
      <ImportModal isOpen={modalState.isOpen} onClose={modalState.onClose} />

      <Tabs isFitted>
        <TabList>
          {Object.entries(content).map(([key, value]) => (
            <Tab key={key}>{value.title}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {Object.entries(content).map(([key, value]) => (
            <TabPanel key={key} px={0}>
              {value?.onClick ? (
                <Box
                  as={Card}
                  bg="backgroundCardHighlight"
                  h="full"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  w="full"
                  _hover={{
                    borderColor: "blue.500",
                    textDecoration: "none!important",
                  }}
                  onClick={() => {
                    if (value.onClick) {
                      value.onClick();
                    }
                    trackEvent({
                      category: TRACKING_CATEGORY,
                      action: "click",
                      label: "deploy_options",
                      type: key,
                      href: null,
                      isExternal: false,
                    });
                  }}
                  gap={4}
                  cursor="pointer"
                >
                  <CardContent tab={key} value={value} />
                </Box>
              ) : (
                <Card
                  bg="backgroundCardHighlight"
                  h="full"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  w="full"
                  _hover={{
                    borderColor: "blue.500",
                    textDecoration: "none!important",
                  }}
                  {...{
                    as: TrackedLink,
                    category: TRACKING_CATEGORY,
                    label: "deploy_options",
                    trackingProps: { type: key },
                    href: value.href,
                    isExternal: value?.href?.startsWith("http"),
                  }}
                  gap={4}
                >
                  <CardContent tab={key} value={value} />
                </Card>
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};

const Contracts: ThirdwebNextPage = () => {
  const address = useAddress();
  const deployedContracts = useAllContractList(address);

  const hasContracts = useMemo(
    () => deployedContracts.data?.length > 0,
    [deployedContracts.data?.length],
  );

  const steps = useMemo(
    () => [
      {
        title: "Connect your wallet to get started",
        description:
          "In order to interact with your contracts you need to connect an EVM compatible wallet.",
        children: <ConnectWallet ecosystem="evm" />,
        completed: !!address,
      },

      {
        title: "Build, deploy or import a contract",
        description:
          "Choose between deploying your own contract or import an existing one.",
        children: <DeployOptions />,
        completed: hasContracts,
      },
    ],
    [address, hasContracts],
  );

  if (address && deployedContracts.isLoading) {
    return (
      <Flex w="full" h="full" alignItems="center" justifyContent="center">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={12}>
      {hasContracts ? (
        <Flex gap={8} direction="column">
          <DeployedContracts contractListQuery={deployedContracts} limit={50} />
        </Flex>
      ) : (
        <StepsCard
          title="Get started with deploying contracts"
          description="This guide will help you to start deploying contracts on-chain in just a few minutes."
          steps={steps}
        />
      )}
    </Flex>
  );
};

Contracts.getLayout = (page, props) => (
  <AppLayout ecosystem="evm" {...props} hasSidebar={true}>
    <ContractsSidebar activePage="deploy" />

    {page}
  </AppLayout>
);
Contracts.pageId = PageId.Contracts;

export default Contracts;
