import { ApiKey, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { useEmbeddedWallets } from "@3rdweb-sdk/react/hooks/useEmbeddedWallets";
import {
  Divider,
  Flex,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  SimpleGrid,
  Switch,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import { CodeEnvironment } from "components/contract-tabs/code/types";
import { EmbeddedWalletsTable } from "components/embedded-wallets";
import { ActiveUsersCard } from "components/embedded-wallets/ActiveUsersCard";
import { CreateApiKeyButton } from "components/settings/ApiKeys/Create";
import { WalletsSidebar } from "core-ui/sidebar/wallets";
import Image from "next/image";
import { PageId } from "page-id";
import { useEffect, useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import {
  Button,
  Card,
  Heading,
  MenuItem,
  Text,
  TrackedLink,
} from "tw-components";
import { withinDays } from "utils/date-utils";
import { ThirdwebNextPage } from "utils/types";
import { shortenString } from "utils/usedapp-external";
import { WALLETS_SNIPPETS } from "./wallet-sdk";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";

const TRACKING_CATEGORY = "embedded-wallet";
const ACTIVE_THRESHOLD_DAYS = 30;

const DashboardWalletsEmbedded: ThirdwebNextPage = () => {
  const { isLoggedIn } = useLoggedInUser();
  const keysQuery = useApiKeys();
  const [environment, setEnvironment] = useState<CodeEnvironment>("javascript");

  const [selectedKey, setSelectedKey] = useState<undefined | ApiKey>();
  const [onlyActive, setOnlyActive] = useState(true);
  const walletsQuery = useEmbeddedWallets(selectedKey?.key as string);

  const apiKeys = useMemo(() => keysQuery?.data || [], [keysQuery]);
  const wallets = walletsQuery?.data || [];

  const hasApiKeys = apiKeys.length > 0;
  const hasWallets = wallets.length > 0;

  const activeWallets = useMemo(() => {
    if (!walletsQuery.data) {
      return [];
    }

    return walletsQuery.data.filter((w) => {
      const lastAccessedAt = w.last_accessed_at;
      return (
        lastAccessedAt && withinDays(lastAccessedAt, ACTIVE_THRESHOLD_DAYS)
      );
    });
  }, [walletsQuery]);

  useEffect(() => {
    if (selectedKey) {
      return;
    }
    if (apiKeys.length > 0) {
      setSelectedKey(apiKeys[0]);
    } else {
      setSelectedKey(undefined);
    }
  }, [apiKeys, selectedKey]);

  return (
    <Flex flexDir="column" gap={10}>
      <Flex flexDir="column" gap={4}>
        <Heading size="title.lg" as="h1">
          Embedded Wallets
        </Heading>
        <Text maxW="xl">
          A wallet infrastructure that enables apps to create, manage, and
          control their users&apos; wallets. Email login, social login, and
          bring-your-own auth supported.{" "}
          <TrackedLink
            isExternal
            href="https://portal.thirdweb.com/embedded-wallet"
            category={TRACKING_CATEGORY}
            label="learn-more"
            color="primary.500"
          >
            Learn more about Embedded Wallet
          </TrackedLink>
        </Text>
      </Flex>

      {isLoggedIn && !hasApiKeys && (
        <Card p={6}>
          <VStack alignItems="center" justifyContent="center" gap={6}>
            <Image
              src="/assets/tw-icons/keys.png"
              width={77}
              height={95}
              alt="no keys"
            />
            <Flex flexDir="column" gap={1} alignItems="center">
              <Text>
                You&apos;ll need to create an API Key to use embedded wallets.
              </Text>
              <CreateApiKeyButton
                buttonProps={{
                  variant: "link",
                  size: "sm",
                  // remove icon
                  leftIcon: undefined,
                }}
                enabledServices={["embeddedWallets"]}
              />
            </Flex>
          </VStack>
        </Card>
      )}

      {isLoggedIn && hasApiKeys && selectedKey && (
        <>
          <ActiveUsersCard count={activeWallets.length} />

          <Divider />

          <Flex
            justifyContent="space-between"
            flexDir={{ base: "column", lg: "row" }}
            gap={4}
          >
            <Menu>
              {({ isOpen }) => (
                <>
                  <Flex
                    w="full"
                    alignItems={{ base: "flex-start", lg: "center" }}
                    gap={1}
                    flexDir={{ base: "column", lg: "row" }}
                  >
                    <Text minW={32}>Select an API Key:</Text>
                    <MenuButton
                      isActive={isOpen}
                      as={Button}
                      rightIcon={<FiChevronDown />}
                      variant="outline"
                      minW={60}
                    >
                      <Flex gap={2} alignItems="center">
                        <Heading size="label.md" isTruncated>
                          {selectedKey.name}
                        </Heading>
                        <Text isTruncated>
                          ({shortenString(selectedKey.key)})
                        </Text>
                      </Flex>
                    </MenuButton>
                  </Flex>
                  <MenuList>
                    {apiKeys.map((apiKey) => (
                      <MenuItem
                        key={apiKey.id}
                        value={apiKey.key}
                        onClick={() => setSelectedKey(apiKey)}
                      >
                        {apiKey.name} ({shortenString(apiKey.key)})
                      </MenuItem>
                    ))}
                  </MenuList>
                </>
              )}
            </Menu>

            <Flex
              gap={2}
              alignItems="center"
              w="full"
              justifyContent={{ base: "flex-start", lg: "flex-end" }}
            >
              <Text>Active last {ACTIVE_THRESHOLD_DAYS} days</Text>
              <Switch
                isChecked={onlyActive}
                onChange={() => setOnlyActive(!onlyActive)}
                disabled={!hasWallets}
              />
            </Flex>
          </Flex>

          {!hasWallets ? (
            <Card p={6}>
              <VStack alignItems="center" justifyContent="center" gap={6}>
                <Image
                  src="/assets/tw-icons/noWallets.png"
                  width={92}
                  height={74}
                  alt="no wallets"
                />
                <Flex flexDir="column" gap={2} alignItems="center">
                  <Text>
                    It looks you don&apos;t have no embedded wallets for this
                    key.
                  </Text>
                  <TrackedLink
                    isExternal
                    href="https://portal.thirdweb.com/embedded-wallet/getting-started"
                    category={TRACKING_CATEGORY}
                    label="getting-started"
                    color="primary.500"
                  >
                    <Text color="primary.500">
                      Get started with embedded wallets
                    </Text>
                  </TrackedLink>
                </Flex>
              </VStack>
            </Card>
          ) : (
            <EmbeddedWalletsTable
              wallets={onlyActive ? activeWallets : wallets}
              isLoading={keysQuery.isLoading || walletsQuery.isLoading}
              isFetched={walletsQuery.isFetched}
            />
          )}
        </>
      )}

      {!isLoggedIn && (
        <>
          <Flex flexDir="column" gap={4}>
            <Heading size="title.sm" as="h2">
              Integrate into your app
            </Heading>

            <CodeSegment
              environment={environment}
              setEnvironment={setEnvironment}
              snippet={
                WALLETS_SNIPPETS.find((w) => w.id === "embedded-wallet")
                  ?.supportedLanguages || {}
              }
            />
          </Flex>
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
            <Card
              as={Flex}
              gap={4}
              flex={1}
              bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
              p={6}
            >
              <Flex flexDir={"column"} gap={2}>
                <Heading size="title.sm" as="h1">
                  Docs
                </Heading>
                <UnorderedList>
                  <Text as={ListItem} color="blue.500">
                    <TrackedLink
                      category={TRACKING_CATEGORY}
                      label="docs"
                      trackingProps={{ breakdown: "full-docs" }}
                      href="https://portal.thirdweb.com/embedded-wallet"
                      isExternal
                      _hover={{ opacity: 0.8 }}
                      color="blue.500"
                    >
                      Full Docs
                    </TrackedLink>
                  </Text>
                </UnorderedList>
              </Flex>
            </Card>
            <Card
              as={Flex}
              flexDir={"row"}
              gap={4}
              flex={1}
              p={6}
              overflow="hidden"
              bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
            >
              <Flex flexDir={"column"} gap={2}>
                <Heading size="title.sm" as="h1">
                  Embedded Wallet Guides
                </Heading>
                <UnorderedList>
                  <Text as={ListItem} color="blue.500">
                    <TrackedLink
                      category={TRACKING_CATEGORY}
                      label="guides"
                      trackingProps={{
                        breakdown: "getting-started",
                      }}
                      href="https://portal.thirdweb.com/embedded-wallet/getting-started"
                      isExternal
                      _hover={{ opacity: 0.8 }}
                      color="blue.500"
                    >
                      Getting started with Embedded Wallet
                    </TrackedLink>
                  </Text>
                  <Text as={ListItem} color="blue.500">
                    <TrackedLink
                      category={TRACKING_CATEGORY}
                      label="guides"
                      trackingProps={{
                        breakdown: "gasless-smart-wallet",
                      }}
                      href="https://portal.thirdweb.com/embedded-wallet/smart-wallet-and-embedded-wallet"
                      isExternal
                      _hover={{ opacity: 0.8 }}
                      color="blue.500"
                    >
                      Enable gasless transactions with Embedded Smart Wallet
                    </TrackedLink>
                  </Text>
                </UnorderedList>
              </Flex>
            </Card>
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};

DashboardWalletsEmbedded.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <WalletsSidebar activePage="embedded" />
    {page}
  </AppLayout>
);

DashboardWalletsEmbedded.pageId = PageId.DashboardWalletsEmbedded;

export default DashboardWalletsEmbedded;
