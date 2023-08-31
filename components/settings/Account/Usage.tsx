import { UsageBillableByService } from "@3rdweb-sdk/react/hooks/useApi";
import { SimpleGrid, Spinner, VStack } from "@chakra-ui/react";
import { UsageCard } from "./UsageCard";
import { useMemo } from "react";
import { Heading } from "tw-components";

interface UsageProps {
  usage: UsageBillableByService | undefined;
  usageLoading: boolean;
}

export const Usage: React.FC<UsageProps> = ({
  usage: usageData,
  usageLoading,
}) => {
  const bundlerTotal = useMemo(() => {
    if (!usageData?.billableUsd?.bundler) {
      return <i>N/A</i>;
    }
    const total = usageData.billableUsd.bundler;

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(total);
  }, [usageData]);

  return (
    <VStack gap={8} w="full">
      {usageLoading && <Spinner size="sm" />}
      {!usageLoading && (
        <VStack w="full" gap={12}>
          {/* <VStack alignItems="flex-start" gap={6} w="full">
            <Heading as="h4" size="title.sm">
              Infrastructure
            </Heading>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 2, xl: 3 }}
              gap={6}
              w="full"
            >
              <UsageCard
                title="RPC"
                description="Peak reqs/sec made"
                total={<i>N/A</i>}
                tooltip="Explain here how we calculate and charge for RPC?"
              />
              <UsageCard
                title="Storage Gateway"
                description="Peak reqs/min made"
                total={<i>N/A</i>}
                tooltip="Explain here how we calculate and charge for Gateway?"
              />
              <UsageCard
                title="Storage Pinning"
                description="Total GBs used"
                total={<i>N/A</i>}
                tooltip="Explain here how we calculate and charge for Pinning?"
              />
            </SimpleGrid>
          </VStack> */}

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
                title="Smart Wallets"
                description="Total USD consumed"
                total={bundlerTotal}
                tooltip="Explain here how we calculate and charge for Bundler?"
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
