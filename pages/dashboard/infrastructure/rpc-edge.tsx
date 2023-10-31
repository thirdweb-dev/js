import {
  Flex,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ConfigureNetworkButton } from "components/contract-components/shared/configure-network-button";
import { ChainIcon } from "components/icons/ChainIcon";
import { InfrastructureSidebar } from "core-ui/sidebar/infrastructure";
import { useSupportedChains } from "hooks/chains/configureChains";
import { PageId } from "page-id";
import { Card, Heading, Link, Text, TrackedCopyButton } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "rpc";

export const DashboardRPC: ThirdwebNextPage = () => {
  const configuredChains = useSupportedChains();

  return (
    <Flex flexDir="column" gap={8}>
      <Flex
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Flex flexDir="column" gap={2}>
          <Heading size="title.lg" as="h1">
            RPC
          </Heading>
          <Text>
            This list show all your configured chains and all the RPC endpoints
            that thirdweb supports.{" "}
            <Link href="/chainlist" color="blue.500">
              See all supported chains
            </Link>
            .
          </Text>
        </Flex>
        <ConfigureNetworkButton label="rpc-page">
          Add Network
        </ConfigureNetworkButton>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        {configuredChains.map((chain) => (
          <LinkBox key={chain.chainId} position="relative" role="group">
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
                  <ChainIcon size={20} ipfsSrc={chain?.icon?.url} />
                  <LinkOverlay href={`/${chain.slug}`}>
                    <Heading size="subtitle.sm" as="h3" noOfLines={1}>
                      {chain.name}
                    </Heading>
                  </LinkOverlay>
                </Flex>
              </Flex>
              <Flex>
                <Flex flexDir="column" gap={1} w="full">
                  <Text opacity={0.6}>RPC URL</Text>
                  {chain.rpc.findIndex((c) => c.indexOf("thirdweb.com") > -1) >
                  -1 ? (
                    <InputGroup>
                      <Input
                        readOnly
                        value={`${chain.slug}.rpc.thirdweb.com`}
                      />
                      <InputRightElement>
                        <TrackedCopyButton
                          category={TRACKING_CATEGORY}
                          label="copy-rpc-url"
                          aria-label="Copy RPC url"
                          size="sm"
                          colorScheme={undefined}
                          value={`${chain.slug}.rpc.thirdweb.com`}
                        />
                      </InputRightElement>
                    </InputGroup>
                  ) : (
                    <Input
                      readOnly
                      isDisabled
                      pointerEvents="none"
                      value="Coming Soon"
                    />
                  )}
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
          </LinkBox>
        ))}
      </SimpleGrid>
    </Flex>
  );
};

DashboardRPC.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <InfrastructureSidebar activePage="rpc-edge" />
    {page}
  </AppLayout>
);

DashboardRPC.pageId = PageId.DashboardRPC;

export default DashboardRPC;
