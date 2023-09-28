import { UsageBillableByService } from "@3rdweb-sdk/react/hooks/useApi";
import { SimpleGrid, Spinner, VStack } from "@chakra-ui/react";
import { UsageCard } from "./UsageCard";
import { useMemo } from "react";
import { Heading, Text } from "tw-components";
import { toNumber, toPercent, toSize } from "utils/number";

interface UsageProps {
  usage: UsageBillableByService | undefined;
  usageLoading: boolean;
}

export const Usage: React.FC<UsageProps> = ({
  usage: usageData,
  usageLoading,
}) => {
  const bundlerMetrics = useMemo(() => {
    const metric = {
      title: "Total sponsored fees",
      total: 0,
    };

    if (!usageData) {
      return metric;
    }

    return {
      title: metric.title,
      total: usageData.billableUsd.bundler,
    };
  }, [usageData]);

  const storageMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    const consumedBytes = usageData.usage.storage.sumFileSizeBytes;
    const limitBytes = usageData.limits.storage;
    const percent = toPercent(consumedBytes, limitBytes);

    return {
      total: `${toSize(consumedBytes, "MB")} / ${toSize(
        limitBytes,
      )} (${percent}%)`,
      progress: percent,
      ...(usageData.billableUsd.storage > 0
        ? {
            overage: usageData.billableUsd.storage,
          }
        : {}),
    };
  }, [usageData]);

  const walletsMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    const numOfWallets = usageData.usage.embeddedWallets.countWalletAddresses;
    const limitWallets = usageData.limits.embeddedWallets;
    const percent = toPercent(numOfWallets, limitWallets);

    return {
      total: `${toNumber(numOfWallets)} / ${toNumber(
        limitWallets,
      )} (${percent}%)`,
      progress: percent,
      ...(usageData.billableUsd.embeddedWallets > 0
        ? {
            overage: usageData.billableUsd.embeddedWallets,
          }
        : {}),
    };
  }, [usageData]);

  const rpcMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    return {
      title: "Unlimited requests",
      total: (
        <>
          Max rate:{" "}
          <Text color="bgBlack" as="span">
            {usageData.rateLimits.rpc} requests per second
          </Text>
        </>
      ),
    };
  }, [usageData]);

  const gatewayMetrics = useMemo(() => {
    if (!usageData) {
      return {};
    }

    return {
      title: "Unlimited requests",
      total: (
        <>
          Max rate:{" "}
          <Text color="bgBlack" as="span">
            {usageData.rateLimits.storage} requests per second
          </Text>
        </>
      ),
    };
  }, [usageData]);

  return (
    <VStack gap={8} w="full">
      {usageLoading && <Spinner size="sm" />}
      {!usageLoading && (
        <VStack w="full" gap={12}>
          <VStack alignItems="flex-start" gap={6} w="full">
            <Heading as="h4" size="title.sm">
              Infrastructure
            </Heading>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 2, xl: 3 }}
              gap={6}
              w="full"
            >
              <UsageCard
                {...rpcMetrics}
                name="RPC"
                tooltip="RPC usage is calculated by requests per second."
              />
              <UsageCard
                {...gatewayMetrics}
                name="Storage Gateway"
                tooltip="Storage gateway usage is calculated by GB per file size."
              />
              <UsageCard
                {...storageMetrics}
                name="Storage Pinning"
                tooltip="Storage pinning usage is calculated by GB per file size."
              />
            </SimpleGrid>
          </VStack>

          <VStack alignItems="flex-start" gap={6} w="full">
            <Heading as="h4" size="title.sm">
              Wallets
            </Heading>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 2, xl: 3 }}
              gap={6}
              w="full"
            >
              <UsageCard
                {...walletsMetrics}
                name="Email Wallets"
                tooltip="Email wallet (with managed recovery code) usage is calculated by monthly active wallets (i.e. active as defined by at least 1 user log-in via email or social within the billing period month)."
              />
            </SimpleGrid>
          </VStack>

          <VStack alignItems="flex-start" gap={6} w="full">
            <Heading as="h4" size="title.sm">
              Payments
            </Heading>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 2, xl: 3 }}
              gap={6}
              w="full"
            >
              <UsageCard
                {...bundlerMetrics}
                name="Smart Wallets"
                tooltip="Smart Wallets (Gasless, Paymaster, Bundler) usage is calculated by sponsored network fees."
              />
            </SimpleGrid>
          </VStack>
        </VStack>
      )}
    </VStack>
  );
};
