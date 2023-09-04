import { UsageBillableByService } from "@3rdweb-sdk/react/hooks/useApi";
import { SimpleGrid, Spinner, VStack } from "@chakra-ui/react";
import { UsageCard } from "./UsageCard";
import { useMemo } from "react";
import { Heading } from "tw-components";
import { toSize, toUSD } from "utils/number";

interface UsageProps {
  usage: UsageBillableByService | undefined;
  usageLoading: boolean;
}

export const Usage: React.FC<UsageProps> = ({
  usage: usageData,
  usageLoading,
}) => {
  const bundlerMetrics = useMemo(() => {
    const metric = [
      {
        title: "Total USD consumed",
        total: <i>N/A</i>,
      },
    ];

    if (!usageData?.billableUsd.bundler) {
      return metric;
    }

    return [
      {
        title: metric[0].title,
        total: toUSD(usageData.billableUsd.bundler),
      },
    ];
  }, [usageData]);

  const storageMetrics = useMemo(() => {
    const metric = [
      {
        title: "Total GB pinned",
        total: <i>N/A</i>,
      },
    ];

    if (!usageData?.limits.storage || !usageData?.usage.storage) {
      return metric;
    }

    const consumedBytes = usageData.usage.storage.sumFileSizeBytes;
    const limitBytes = usageData.limits.storage;
    const percent = Math.round(((consumedBytes / limitBytes) * 100 * 10) / 10);

    const metrics = [
      {
        title: metric[0].title,
        total: `${toSize(consumedBytes)} / ${toSize(limitBytes)} (${percent}%)`,
        progress: percent,
      },
      ...(usageData.billableUsd.storage > 0
        ? [
            {
              title: "Overage USD",
              total: toUSD(usageData.billableUsd.storage),
            },
          ]
        : []),
    ];

    return metrics;
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
              {/* <UsageCard
                title="RPC"
                description="Peak reqs/sec made"
                total={<i>N/A</i>}
                tooltip="Explain here how we calculate and charge for RPC?"
              /> */}
              {/* <UsageCard
                title="Storage Gateway"
                description="Peak reqs/min made"
                total={<i>N/A</i>}
                tooltip="Explain here how we calculate and charge for Gateway?"
              /> */}
              <UsageCard
                name="Storage Pinning"
                metrics={storageMetrics}
                tooltip="Each additional GB over your plan limit costs $0.10."
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
                name="Smart Wallets"
                metrics={bundlerMetrics}
                tooltip="An additional 10% premium is applied to your transactions."
              />
            </SimpleGrid>
          </VStack>

          {/* <VStack alignItems="flex-start" gap={6} w="full">
            <Heading as="h4" size="title.sm">
              Wallets
            </Heading>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 2, xl: 3 }}
              gap={6}
              w="full"
            >
              <UsageCard
                title="Embedded Wallets"
                description="Monthly active logins"
                total={<i>N/A</i>}
                tooltip="Explain here how we calculate and charge for Embedded Wallets?"
              />
            </SimpleGrid>
          </VStack> */}
        </VStack>
      )}
    </VStack>
  );
};
