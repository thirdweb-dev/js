import { Spinner } from "@/components/ui/Spinner/Spinner";
import { type ApiKey, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { useEmbeddedWallets } from "@3rdweb-sdk/react/hooks/useEmbeddedWallets";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Flex, Grid, HStack, Icon, Spacer } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { EmbeddedWallets } from "components/embedded-wallets";
import { ApiKeysMenu } from "components/settings/ApiKeys/Menu";
import { NoApiKeys } from "components/settings/ApiKeys/NoApiKeys";
import { ConnectSidebar } from "core-ui/sidebar/connect";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useMemo, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Card, Heading, Text, TrackedLink } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";
import { SupportedPlatformLink } from "../../../components/wallets/SupportedPlatformLink";

const TRACKING_CATEGORY = "embedded-wallet";

const DashboardConnectEmbeddedWallets: ThirdwebNextPage = () => {
  const router = useRouter();
  const defaultTabIndex = Number.parseInt(router.query.tab?.toString() || "0");
  const defaultClientId = router.query.clientId?.toString();
  const { isLoading } = useLoggedInUser();
  const keysQuery = useApiKeys();

  const [selectedKey_, setSelectedKey] = useState<undefined | ApiKey>();

  const apiKeys = useMemo(() => {
    return (keysQuery?.data || []).filter((key) => {
      return !!(key.services || []).find(
        (srv) => srv.name === "embeddedWallets",
      );
    });
  }, [keysQuery]);

  const hasApiKeys = apiKeys.length > 0;

  // compute the actual selected key based on if there is a state, if there is a query param, or otherwise the first one
  const selectedKey = useMemo(() => {
    if (selectedKey_) {
      return selectedKey_;
    }
    if (apiKeys.length) {
      if (defaultClientId) {
        return apiKeys.find((k) => k.key === defaultClientId);
      }
      return apiKeys[0];
    }
    return undefined;
  }, [apiKeys, defaultClientId, selectedKey_]);

  const walletsQuery = useEmbeddedWallets(selectedKey?.key as string);

  const wallets = walletsQuery?.data || [];

  if (isLoading) {
    return (
      <div className="grid w-full place-items-center">
        <Spinner className="size-14" />
      </div>
    );
  }

  return (
    <Flex flexDir="column" gap={8}>
      <Flex flexDir="column" gap={2}>
        <Flex
          justifyContent="space-between"
          direction={{ base: "column", lg: "row" }}
          gap={4}
        >
          <Heading size="title.lg" as="h1">
            In-App Wallets
          </Heading>
          {hasApiKeys && (
            <HStack gap={3}>
              {selectedKey && (
                <ApiKeysMenu
                  apiKeys={apiKeys}
                  selectedKey={selectedKey}
                  onSelect={setSelectedKey}
                />
              )}
            </HStack>
          )}
        </Flex>

        <Text maxW="xl">
          A wallet infrastructure that enables apps to create, manage, and
          control their users wallets. Email login, social login, and
          bring-your-own auth supported.{" "}
          <TrackedLink
            isExternal
            href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
            label="learn-more"
            category={TRACKING_CATEGORY}
            color="primary.500"
          >
            Learn more
          </TrackedLink>
        </Text>
      </Flex>

      {!hasApiKeys && <NoApiKeys service="in-app wallets" />}

      {hasApiKeys && selectedKey && (
        <EmbeddedWallets
          apiKey={selectedKey}
          wallets={wallets}
          isLoading={walletsQuery.isLoading}
          isFetched={walletsQuery.isFetched}
          trackingCategory={TRACKING_CATEGORY}
          defaultTabIndex={defaultTabIndex}
        />
      )}

      <Spacer height={20} />

      <FooterSection />
    </Flex>
  );
};

function FooterSection() {
  return (
    <Grid templateColumns={["1fr", "1fr 1fr"]} gap={5}>
      <Grid templateColumns="1fr" gap={5}>
        <ViewDocs />
      </Grid>
      <Templates />
    </Grid>
  );
}

function ViewDocs() {
  return (
    <Card p={5}>
      <Flex gap={2} alignItems="center">
        <Heading fontSize={16} as="h3">
          View Docs
        </Heading>
        <Icon as={AiOutlineArrowRight} width={5} height={5} />
      </Flex>

      <Spacer height={6} />

      <Grid templateColumns={"1fr 1fr"} gap={3} maxW="400px">
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          size="md"
          noBorder
          platform="React"
          href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
        />

        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          noBorder
          size="md"
          platform="Unity"
          href="https://portal.thirdweb.com/unity/wallets/providers/embedded-wallet"
        />
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          noBorder
          size="md"
          platform="React Native"
          href="https://portal.thirdweb.com/react-native/latest/connect/in-app-wallet"
        />
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          noBorder
          size="md"
          platform="TypeScript"
          href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
        />
      </Grid>

      <Spacer height={5} />

      <Flex gap={2} alignItems="center">
        <Heading fontSize={16} as="h3">
          Relevant Guides
        </Heading>
        <Icon as={AiOutlineArrowRight} width={5} height={5} />
      </Flex>

      <Spacer height={5} />

      <Flex gap={3} flexDirection="column">
        <GuideLink
          href="https://blog.thirdweb.com/what-are-embedded-wallets/"
          label="what-is-an-embedded-wallet"
        >
          What is an in-app wallet?
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/get-started"
          label="sdks-get-started"
        >
          Get started with In-App Wallets
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/how-to/connect-users"
          label="how-to-connect-your-users"
        >
          Using In-App Wallets with Connect
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/how-to/build-your-own-ui"
          label="how-to-build-your-own-ui"
        >
          How to Build Your Own UI
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/custom-auth/custom-auth-server"
          label="how-to-custom-auth-server"
        >
          Create a custom auth server
        </GuideLink>
      </Flex>
    </Card>
  );
}

function GuideLink(props: {
  label: string;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <TrackedLink
      category={TRACKING_CATEGORY}
      label={"guide"}
      trackingProps={{
        guide: props.label,
      }}
      href={props.href}
      color="paragraph"
      isExternal
      _hover={{
        color: "blue.500",
      }}
    >
      {props.children}
    </TrackedLink>
  );
}

function Templates() {
  return (
    <Card p={5}>
      <Flex gap={2} alignItems="center">
        <Heading fontSize={16} as="h3">
          Relevant Templates
        </Heading>
        <Icon as={AiOutlineArrowRight} width={5} height={5} />
      </Flex>

      <Spacer height={6} />

      <Flex gap={3} flexDirection="column">
        <GuideLink
          href="https://github.com/thirdweb-example/embedded-smart-wallet"
          label="embedded-smart-wallet"
        >
          In-App Wallet + Account Abstraction Starter Kit
        </GuideLink>

        <GuideLink
          href="https://github.com/thirdweb-example/catattacknft"
          label="embedded-cat-attack"
        >
          Cat Attack [Demo Web Game]
        </GuideLink>

        <GuideLink
          href="https://github.com/thirdweb-example/embedded-wallet-custom-ui"
          label="embedded-wallet-with-custom-ui-react"
        >
          In-App Wallet With Custom UI [React]
        </GuideLink>

        <GuideLink
          href="https://github.com/thirdweb-example/embedded-wallet-custom-ui-react-native"
          label="embedded-wallet-with-custom-ui-react-native"
        >
          In-App Wallet With Custom UI [ReactNative]
        </GuideLink>
      </Flex>
    </Card>
  );
}

DashboardConnectEmbeddedWallets.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <ConnectSidebar activePage="embedded-wallets" />
    {page}
  </AppLayout>
);

DashboardConnectEmbeddedWallets.pageId = PageId.DashboardConnectEmbeddedWallets;

export default DashboardConnectEmbeddedWallets;
