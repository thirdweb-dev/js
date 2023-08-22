import { Card, Heading, TrackedLink, TrackedLinkProps } from "tw-components";
import React, { useState } from "react";
import { Flex, GridItem, Icon, SimpleGrid, Tooltip } from "@chakra-ui/react";
import { useTabHref } from "contract-ui/utils";
import { ChartContainer } from "components/analytics/chart-container";
import { AnalyticsChart } from "contract-ui/tabs/analytics/page";
import {
  useLogsAnalytics,
  useTransactionAnalytics,
  useUniqueWalletsAnalytics,
} from "data/analytics/hooks";
import { FiInfo } from "react-icons/fi";

interface AnalyticsOverviewProps {
  chainId: number;
  contractAddress: string;
  trackingCategory: TrackedLinkProps["category"];
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  chainId,
  contractAddress,
  trackingCategory,
}) => {
  const [startDate] = useState(
    (() => {
      const date = new Date();
      date.setDate(date.getDate() - 11);
      return date;
    })(),
  );
  const [endDate] = useState(new Date());

  const analyticsHref = useTabHref("analytics");

  return (
    <Flex direction="column" gap={{ base: 3, md: 6 }}>
      <Flex align="center" justify="space-between" w="full">
        <Heading size="title.sm">Analytics</Heading>
        <TrackedLink
          category={trackingCategory}
          label="view_all_nfts"
          color="blue.400"
          _light={{
            color: "blue.600",
          }}
          gap={4}
          href={analyticsHref}
        >
          View all -&gt;
        </TrackedLink>
      </Flex>

      <SimpleGrid gap={{ base: 3, md: 6 }} columns={{ base: 2, md: 3 }}>
        <GridItem>
          <Flex
            flexDir="column"
            gap={4}
            as={Card}
            bg="backgroundHighlight"
            h="full"
          >
            <Flex align="center" justify="space-between">
              <Heading size="label.md">Unique Wallets</Heading>
              <Tooltip
                p={0}
                label={
                  <Flex p={2} fontSize="small" color="white">
                    The number of unique wallet addresses that have sent a
                    transaction to this contract.
                  </Flex>
                }
                bgColor="backgroundCardHighlight"
                borderRadius="lg"
                placement="right"
                shouldWrapChildren
              >
                <Icon as={FiInfo} boxSize={4} color="gray.700" />
              </Tooltip>
            </Flex>
            <ChartContainer w="full" ratio={1.7}>
              <AnalyticsChart
                contractAddress={contractAddress}
                chainId={chainId}
                startDate={startDate}
                endDate={endDate}
                index={"time"}
                categories={[{ id: "wallets", label: "Unique Wallets" }]}
                useAnalytics={useUniqueWalletsAnalytics}
                showYAxis={false}
              />
            </ChartContainer>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex
            flexDir="column"
            gap={4}
            as={Card}
            bg="backgroundHighlight"
            h="full"
          >
            <Flex align="center" justify="space-between">
              <Heading size="label.md">Total Transactions</Heading>
              <Tooltip
                p={0}
                label={
                  <Flex p={2} fontSize="small" color="white">
                    The number of transactions that have been sent to this
                    contract.
                  </Flex>
                }
                bgColor="backgroundCardHighlight"
                borderRadius="lg"
                placement="right"
                shouldWrapChildren
              >
                <Icon as={FiInfo} boxSize={4} color="gray.700" />
              </Tooltip>
            </Flex>
            <ChartContainer w="full" ratio={1.7}>
              <AnalyticsChart
                contractAddress={contractAddress}
                chainId={chainId}
                startDate={startDate}
                endDate={endDate}
                index={"time"}
                categories={[{ id: "count", label: "Transactions" }]}
                useAnalytics={useTransactionAnalytics}
                showYAxis={false}
              />
            </ChartContainer>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex
            flexDir="column"
            gap={4}
            as={Card}
            bg="backgroundHighlight"
            h="full"
          >
            <Flex align="center" justify="space-between">
              <Heading size="label.md">Total Events</Heading>
              <Tooltip
                p={0}
                label={
                  <Flex p={2} fontSize="small" color="white">
                    The number of on-chain events that have been emitted from
                    this contract.
                  </Flex>
                }
                bgColor="backgroundCardHighlight"
                borderRadius="lg"
                placement="right"
                shouldWrapChildren
              >
                <Icon as={FiInfo} boxSize={4} color="gray.700" />
              </Tooltip>
            </Flex>
            <ChartContainer w="full" ratio={1.7}>
              <AnalyticsChart
                contractAddress={contractAddress}
                chainId={chainId}
                startDate={startDate}
                endDate={endDate}
                index={"time"}
                categories={[{ id: "count", label: "Events" }]}
                useAnalytics={useLogsAnalytics}
                showYAxis={false}
              />
            </ChartContainer>
          </Flex>
        </GridItem>
      </SimpleGrid>
    </Flex>
  );
};
