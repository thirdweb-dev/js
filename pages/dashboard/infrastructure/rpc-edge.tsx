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
import {
  Card,
  Heading,
  Link,
  Text,
  TrackedCopyButton,
  TrackedLink,
} from "tw-components";
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
        {configuredChains.map((chain) => {
          const isDeprecated = chain.status === "deprecated";
          return (
            <LinkBox
              key={chain.chainId}
              position="relative"
              role="group"
              sx={{
                contentVisibility: "auto",
                containIntrinsicSize: "1px 195px",
              }}
            >
              <Card
                role="group"
                display="flex"
                flexDir="column"
                gap={4}
                px={5}
                // bg="transparent"
                borderColor="borderColor"
                transition="150ms border-color ease-in-out"
                _hover={{
                  _dark: {
                    borderColor: "white",
                  },
                  _light: {
                    borderColor: "black",
                  },
                }}
                position="relative"
                h="full"
              >
                <Flex justifyContent="space-between" align="center">
                  <Flex align="center" gap={2}>
                    <ChainIcon size={20} ipfsSrc={chain?.icon?.url} />
                    <LinkOverlay
                      as={TrackedLink}
                      category={TRACKING_CATEGORY}
                      href={`/${chain.slug}`}
                    >
                      <Heading size="subtitle.sm" as="h3" noOfLines={1}>
                        {chain.name}
                      </Heading>
                    </LinkOverlay>
                    {isDeprecated && (
                      <Flex
                        borderRadius="full"
                        align="center"
                        border="1px solid"
                        borderColor="borderColor"
                        overflow="hidden"
                        flexShrink={0}
                        py={{ base: 1.5, md: 1 }}
                        px={{ base: 1.5, md: 2 }}
                        gap={3}
                      >
                        <Heading size="label.sm" as="label">
                          Deprecated
                        </Heading>
                      </Flex>
                    )}
                  </Flex>
                </Flex>

                <Flex flexDir="column" gap={1}>
                  <Text
                    pointerEvents="none"
                    opacity={0.6}
                    color={isDeprecated ? "faded" : "inherit"}
                  >
                    RPC URL
                  </Text>
                  {chain.rpc.findIndex((c) => c.indexOf("thirdweb.com") > -1) >
                    -1 && !isDeprecated ? (
                    <InputGroup>
                      <Input
                        readOnly
                        value={`${chain.slug}.rpc.thirdweb.com`}
                        isDisabled={isDeprecated}
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
                      value="Unavailable"
                    />
                  )}
                </Flex>

                <SimpleGrid pointerEvents="none" gap={12} columns={2}>
                  <Flex as={GridItem} flexDir="column" gap={1}>
                    <Text
                      opacity={0.6}
                      color={isDeprecated ? "faded" : "inherit"}
                    >
                      Chain ID
                    </Text>
                    <Text
                      size="label.md"
                      color={isDeprecated ? "faded" : "inherit"}
                    >
                      {chain.chainId}
                    </Text>
                  </Flex>
                  <Flex as={GridItem} flexDir="column" gap={1}>
                    <Text
                      opacity={0.6}
                      color={isDeprecated ? "faded" : "inherit"}
                    >
                      Native Token
                    </Text>
                    <Text
                      size="label.md"
                      color={isDeprecated ? "faded" : "inherit"}
                    >
                      {chain.nativeCurrency.symbol}
                    </Text>
                  </Flex>
                </SimpleGrid>
              </Card>
            </LinkBox>
          );
        })}
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
