import { ConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { Center, Flex, Spinner } from "@chakra-ui/react";
import { useUser } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { StepsCard } from "components/dashboard/StepsCard";
import { ApiKeyTable } from "components/settings/ApiKeyTable";
import { CreateApiKeyButton } from "components/settings/CreateApiKeyButton";
import { PageId } from "page-id";
import React, { useMemo } from "react";
import { Heading, Link, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const DashboardApiKeys: ThirdwebNextPage = () => {
  const { user } = useUser();
  const keysQuery = useApiKeys();

  const steps = useMemo(
    () => [
      {
        title: "Connect and sign-in with your wallet to get started",
        description:
          "In order to create and manage your developer API keys, you need to sign-in with a wallet.",
        children: <ConnectWallet ecosystem="evm" requireLogin={true} />,
        completed: !!user?.address,
      },
      {
        title: "Create your first API key",
        description:
          "Your API key can be used to access thirdweb infrastructure services like smart wallets, storage, analytics, and more.",
        children: <CreateApiKeyButton />,
        completed: (keysQuery.data?.length || 0) > 0,
      },
    ],
    [user?.address, keysQuery.data?.length],
  );

  if (!user?.address || (keysQuery.isFetched && keysQuery.data?.length === 0)) {
    return (
      <StepsCard
        title="Get started with thirdweb developer API keys"
        description="Create a new API key to get started with thirdweb infrastructure services"
        steps={steps}
      />
    );
  }

  return (
    <Flex flexDir="column" gap={8} mt={{ base: 2, md: 6 }}>
      <Flex direction="column" gap={2}>
        <Flex
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <Heading size="title.lg" as="h1">
            API Keys
          </Heading>
          <CreateApiKeyButton />
        </Flex>
        <Text>
          API keys are required to work with thirdweb&apos;s smart wallet
          infrastructure services. Find the full list of supported networks{" "}
          <Link
            href="https://portal.thirdweb.com/wallet/smart-wallet"
            color="blue.400"
            isExternal
          >
            here
          </Link>
        </Text>
      </Flex>

      <ApiKeyTable isLoading={keysQuery.isLoading} keys={keysQuery.data || []}>
        {keysQuery.isLoading && (
          <Center>
            <Flex py={4} direction="row" gap={4} align="center">
              <Spinner size="sm" />
              <Text>Loading API Keys</Text>
            </Flex>
          </Center>
        )}
        {keysQuery.data?.length === 0 && keysQuery.isFetched && (
          <Center>
            <Flex py={4} direction="column" gap={4} align="center">
              <Text>No API keys found. Create one to get started!</Text>
            </Flex>
          </Center>
        )}
      </ApiKeyTable>
    </Flex>
  );
};

DashboardApiKeys.getLayout = (page, props) => (
  <AppLayout {...props}>{page}</AppLayout>
);

DashboardApiKeys.pageId = PageId.DashboardApiKeys;

export default DashboardApiKeys;
