import { GetStarted } from "../../../components/dashboard/GetStarted";
import { ContractsSidebar } from "../../../core-ui/sidebar/contracts";
import { useAllContractList } from "@3rdweb-sdk/react";
import { ConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { AppLayout } from "components/app-layouts/app";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import Image from "next/image";
import { PageId } from "page-id";
import { useMemo, useState } from "react";
import { FiChevronsRight } from "react-icons/fi";
import { Button, Card, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "your_contracts";
const DeployOptions = () => {
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
      description: "Deploy your contract by using thirdweb’s interactive CLI.",
      href: "https://portal.thirdweb.com/cli",
    },
  };

  const [tab, setTab] = useState<keyof typeof content>("explore");

  return (
    <Flex flexDir="column" gap={8} w="full">
      <Flex gap={4} flexWrap="wrap">
        {Object.entries(content).map(([key, v]) => (
          <Button
            key={key}
            onClick={() => setTab(key as keyof typeof content)}
            {...(key !== tab && { background: "transparent", opacity: 0.7 })}
          >
            {v.title}
          </Button>
        ))}
      </Flex>
      <Card
        display="flex"
        py={4}
        px={6}
        justifyContent="space-between"
        alignItems="center"
        w="full"
        _hover={{ borderColor: "white", textDecoration: "none!important" }}
        {...{
          as: TrackedLink,
          category: TRACKING_CATEGORY,
          label: "deploy_options",
          trackingProps: { type: tab },
          href: content[tab].href,
          isExternal: tab !== "explore",
        }}
      >
        <Box>
          <Flex alignItems="center">
            <Image
              width={32}
              height={32}
              alt=""
              src={`/assets/dashboard/contracts/${tab}.png`}
            />
            <Text ml={2} size="body.lg" fontWeight="bold">
              {content[tab].title}
            </Text>
          </Flex>
          <Text mt={3} maxW="sm">
            {content[tab].description}
          </Text>
        </Box>
        <Box ml={2} flexShrink={0}>
          <FiChevronsRight size="2rem" />
        </Box>
      </Card>
    </Flex>
  );
};

const Contracts: ThirdwebNextPage = () => {
  const address = useAddress();
  // const chainId = useChainId();
  // const evmBalance = useBalance();
  // const [, switchNetwork] = useNetworkWithPatchedSwitching();
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
      // {
      //   title: "Switch to the test network Mumbai",
      //   description:
      //     "This network allows you to deploy contracts within a testing environment.",
      //   children: (
      //     <Button
      //       bg="white"
      //       color="black"
      //       transitionProperty="opacity"
      //       _hover={{
      //         bg: "white",
      //         color: "black",
      //         opacity: 0.9,
      //       }}
      //       onClick={() => switchNetwork?.(ChainId.Mumbai)}
      //     >
      //       Switch networks
      //     </Button>
      //   ),
      //   completed: chainId === ChainId.Mumbai,
      // },
      // {
      //   title: "Get Mumbai testnet funds",
      //   description:
      //     "Follow the link to the testnet faucet, paste your wallet address and click submit.",
      //   children: (
      //     <Link href="https://faucet.polygon.technology/" color="blue.500">
      //       Visit Mumbai faucet --&gt;
      //     </Link>
      //   ),
      //   completed: BigNumber.from(evmBalance.data?.value || 0).gt(0),
      // },
      {
        title: "Deploy or import a contract",
        description: "Deploy a contract with one of the methods below.",
        children: <DeployOptions />,
        completed: hasContracts,
      },
    ],
    [address, hasContracts],
  );

  return (
    <Box pt={8}>
      <ClientOnly fadeInDuration={600} ssr={null}>
        <ContractsSidebar activePage="deployed" />
        {address && deployedContracts.isLoading ? (
          <Flex w="full" h="full" alignItems="center" justifyContent="center">
            <Spinner />
          </Flex>
        ) : (
          <Flex flexDir="column" gap={12}>
            <GetStarted
              title="Get started with deploying contracts"
              description="This guide will help you start deploying contracts on-chain in just a few minutes."
              steps={steps}
            />
            {address && hasContracts && <EVMContracts address={address} />}
          </Flex>
        )}
      </ClientOnly>
    </Box>
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
