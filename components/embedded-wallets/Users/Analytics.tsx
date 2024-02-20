import { useAccountUsage } from "@3rdweb-sdk/react/hooks/useApi";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { UsageCard } from "components/settings/Account/UsageCard";
import { useMemo } from "react";
import { Card, Heading, Text, TrackedLink } from "tw-components";

import { toNumber, toPercent } from "utils/number";

interface AnalyticsProps {
  trackingCategory: string;
}

export const Analytics: React.FC<AnalyticsProps> = ({ trackingCategory }) => {
  const bg = useColorModeValue("backgroundCardHighlight", "transparent");
  const usageQuery = useAccountUsage();

  const walletsMetrics = useMemo(() => {
    if (!usageQuery?.data) {
      return {};
    }

    const usageData = usageQuery.data;

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
  }, [usageQuery]);

  if (usageQuery.isLoading || !usageQuery.data) {
    return null;
  }

  return (
    <Card p={{ base: 6, lg: 12 }} bg={bg}>
      <Flex
        flexDir={{ base: "column", lg: "row" }}
        justifyContent="space-evenly"
        gap={6}
      >
        <Flex flexDir="column" gap={2} justifyContent="center">
          <Text size="label.sm">Analytics</Text>
          <Heading size="title.sm" maxW="md" lineHeight={1.3}>
            View more insights about how users are interacting with your
            application
          </Heading>

          <TrackedLink
            color="blue.500"
            href="/dashboard/connect/analytics"
            category={trackingCategory}
            label="view-analytics"
          >
            View Analytics
          </TrackedLink>
        </Flex>
        <Box minW={280}>
          <UsageCard
            {...walletsMetrics}
            name="Monthly Active Users"
            tooltip="Email wallet (with managed recovery code) usage is calculated by monthly active wallets (i.e. active as defined by at least 1 user log-in via email or social within the billing period month)."
          />
        </Box>
      </Flex>
    </Card>
  );
};
