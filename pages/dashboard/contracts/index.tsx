import { GetStarted } from "../../../components/dashboard/GetStarted";
import { ContractsSidebar } from "../../../core-ui/sidebar/contracts";
import { useAllContractList } from "@3rdweb-sdk/react";
import { ConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  Box,
  Flex,
  GridItem,
  Icon,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import Image from "next/image";
import { PageId } from "page-id";
import { useMemo } from "react";
import { FiChevronsRight } from "react-icons/fi";
import { Card, Heading, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const content = {
  explore: {
    title: "Explore",
    description:
      "Pick from our library of ready-to-deploy contracts and deploy to any EVM chain in just 1-click.",
    href: "/explore",
  },
  build: {
    title: "Build your own",
    description:
      "Get started with ContractKit to create custom contracts specific to your use case.",
    href: "/contractkit",
  },
  deploy: {
    title: "Deploy from source",
    description:
      "Deploy your contract by using our interactive CLI. (Supports Hardhat, Forge, Truffle, and more)",
    href: "https://portal.thirdweb.com/cli",
  },
};

const TRACKING_CATEGORY = "your_contracts";
const DeployOptions = () => {
  return (
    <SimpleGrid columns={3} gap={4}>
      {Object.entries(content).map(([key, value]) => (
        <GridItem key={key} colSpan={{ base: 3, md: 1 }} h="full">
          <Card
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
              isExternal: key !== "explore",
            }}
            gap={4}
          >
            <Box mb="auto">
              <Flex alignItems="center">
                <Image
                  width={32}
                  height={32}
                  alt=""
                  src={`/assets/dashboard/contracts/${key}.png`}
                />
                <Heading ml={2} size="label.lg" as="h4" fontWeight="bold">
                  {value.title}
                </Heading>
              </Flex>
              <Text mt={3}>{value.description}</Text>
            </Box>

            <Icon flexShrink={0} as={FiChevronsRight} boxSize={6} />
          </Card>
        </GridItem>
      ))}
    </SimpleGrid>
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
        title: "Deploy or import a contract",
        description: "Deploy a contract with one of the methods below.",
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
        <GetStarted
          title="Get started with deploying contracts"
          description="This guide will help you start deploying contracts on-chain in just a few minutes."
          steps={steps}
        />
      )}
    </Flex>
  );
};

Contracts.getLayout = (page, props) => (
  <AppLayout ecosystem="evm" {...props}>
    <ContractsSidebar activePage="deployed" />
    {page}
  </AppLayout>
);
Contracts.pageId = PageId.Contracts;

export default Contracts;
