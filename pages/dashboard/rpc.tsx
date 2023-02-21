import {
  Flex,
  GridItem,
  Icon,
  LinkOverlay,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ConfigureNetworkButton } from "components/contract-components/shared/configure-network-button";
import { ChainIcon } from "components/icons/ChainIcon";
import { useConfiguredChains } from "hooks/chains/configureChains";
import { PageId } from "page-id";
import { BsCheck2Circle } from "react-icons/bs";
import { Card, Heading, Text, TrackedCopyButton } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

export const DashboardRPC: ThirdwebNextPage = () => {
  const configuredChains = useConfiguredChains();

  return (
    <Flex flexDir="column" gap={8} mt={{ base: 2, md: 6 }}>
      <Flex justifyContent="space-between">
        <Heading size="title.lg" as="h1">
          RPC
        </Heading>
        <ConfigureNetworkButton label="rpc-page">
          Add Network
        </ConfigureNetworkButton>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        {configuredChains.map((chain) => (
          <LinkOverlay
            key={chain.chainId}
            href={`/${chain.slug}`}
            position="relative"
            role="group"
          >
            <Card
              as={Flex}
              flexDir="column"
              gap={6}
              p={6}
              _groupHover={{ borderColor: "blue.500" }}
              position="relative"
            >
              <Flex justifyContent="space-between">
                <Flex alignItems="center" gap={2}>
                  <ChainIcon size={20} ipfsSrc={chain?.icon?.url} sizes={[]} />
                  <Heading size="subtitle.sm" as="h3" noOfLines={1}>
                    {chain.name}
                  </Heading>
                </Flex>
                <Tooltip
                  p={0}
                  ml={3}
                  label={
                    <Flex p={2}>
                      <Text>Added to dashboard</Text>
                    </Flex>
                  }
                  bgColor="backgroundCardHighlight"
                  borderRadius="xl"
                  placement="right"
                  shouldWrapChildren
                  position="absolute"
                >
                  <Flex alignItems="center">
                    <Icon as={BsCheck2Circle} color="green.500" boxSize={6} />
                  </Flex>
                </Tooltip>
              </Flex>
              <Flex>
                <Flex flexDir="column" gap={1}>
                  <Text opacity={0.6}>RPC URL</Text>
                  <Flex alignItems="center" gap={2}>
                    <Text
                      size="label.md"
                      noOfLines={1}
                    >{`${chain.slug}.rpc.thirdweb.com`}</Text>
                    <Tooltip
                      p={0}
                      label={
                        <Flex p={2}>
                          <Text>Copy RPC URL</Text>
                        </Flex>
                      }
                      bgColor="backgroundCardHighlight"
                      borderRadius="xl"
                      placement="top"
                      shouldWrapChildren
                    >
                      <TrackedCopyButton
                        value={`https://${chain.slug}.rpc.thirdweb.com`}
                        category="rpc"
                        label="copy-rpc-url"
                        aria-label="Copy RPC URL"
                        colorScheme={undefined}
                      />
                    </Tooltip>
                  </Flex>
                </Flex>
              </Flex>
              <SimpleGrid gap={12} columns={12}>
                <Flex as={GridItem} colSpan={4} flexDir="column" gap={1}>
                  <Text opacity={0.6}>Chain ID</Text>
                  <Text size="label.md">{chain.chainId}</Text>
                </Flex>
                <Flex as={GridItem} flexDir="column" colSpan={8} gap={1}>
                  <Text opacity={0.6}>Native Token</Text>
                  <Text size="label.md">{chain.nativeCurrency.symbol}</Text>
                </Flex>
              </SimpleGrid>
            </Card>
          </LinkOverlay>
        ))}
      </SimpleGrid>
    </Flex>
  );
};

DashboardRPC.getLayout = (page, props) => (
  <AppLayout {...props}>{page}</AppLayout>
);

DashboardRPC.pageId = PageId.DashboardRPC;

export default DashboardRPC;
