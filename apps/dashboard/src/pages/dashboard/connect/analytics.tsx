import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  type ApiKey,
  useApiKeys,
  useWalletStats,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  Flex,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  AutoBarChart,
  BAR_COLORS_DARK,
  BAR_COLORS_LIGHT,
} from "components/analytics/auto-bar-chart";
import { ChartContainer } from "components/analytics/chart-container";
import { AppLayout } from "components/app-layouts/app";
import { GatedFeature } from "components/settings/Account/Billing/GatedFeature";
import { ApiKeysMenu } from "components/settings/ApiKeys/Menu";
import { ConnectSidebar } from "core-ui/sidebar/connect";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { Card, Heading, LinkButton, Text } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const RADIAN = Math.PI / 180;

const DashboardConnectAnalytics: ThirdwebNextPage = () => {
  const router = useRouter();
  const defaultClientId = router.query.clientId?.toString();
  const { theme } = useTheme();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isLoading } = useLoggedInUser();
  const keysQuery = useApiKeys();
  const [selectedKey_, setSelectedKey] = useState<undefined | ApiKey>();

  const [activeIndex, setActiveIndex] = useState(0);

  const apiKeys = useMemo(() => {
    return keysQuery?.data || [];
  }, [keysQuery]);

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

  const statsQuery = useWalletStats(selectedKey?.key);

  const barColors = useMemo(
    () => (theme === "light" ? BAR_COLORS_LIGHT : BAR_COLORS_DARK),
    [theme],
  );

  const pieChartData = useMemo(() => {
    return statsQuery.data
      ? Object.values(
          statsQuery.data.timeSeries.reduce(
            (acc, curr) => {
              if (!acc[curr.walletType]) {
                acc[curr.walletType] = {
                  walletType: curr.walletType,
                  totalWallets: curr.totalWallets,
                };
              } else {
                acc[curr.walletType].totalWallets += curr.totalWallets;
              }
              return acc;
            },
            {} as Record<string, { walletType: string; totalWallets: number }>,
          ),
        )
      : [];
  }, [statsQuery.data]);

  const barChartData = useMemo(() => {
    return statsQuery.data
      ? Object.values(
          statsQuery.data.timeSeries.reduce(
            (acc, curr) => {
              if (!acc[curr.dayTime]) {
                acc[curr.dayTime] = {
                  time: new Date(curr.dayTime).getTime(),
                  totalWallets: curr.totalWallets,
                  uniqueWallets: curr.uniqueWallets,
                };
              } else {
                acc[curr.dayTime].totalWallets += curr.totalWallets;
                acc[curr.dayTime].uniqueWallets += curr.uniqueWallets;
              }
              return acc;
            },
            {} as Record<
              string,
              { time: number; totalWallets: number; uniqueWallets: number }
            >,
          ),
        )
      : [];
  }, [statsQuery.data]);

  const walletBarChartData = useMemo(() => {
    return statsQuery.data
      ? Object.values(
          statsQuery.data.timeSeries.reduce(
            (acc, curr) => {
              if (!acc[curr.dayTime]) {
                acc[curr.dayTime] = {
                  time: new Date(curr.dayTime).getTime(),
                  [curr.walletType]: curr.totalWallets,
                };
              } else {
                acc[curr.dayTime][curr.walletType] = curr.totalWallets;
              }
              return acc;
            },
            // biome-ignore lint/suspicious/noExplicitAny: FIXME
            {} as Record<string, any>,
          ),
        )
      : [];
  }, [statsQuery.data]);

  const totalStatsData = useMemo(() => {
    return statsQuery.data
      ? statsQuery.data.timeSeries.reduce(
          (acc, curr) => {
            acc.totalWallets += curr.totalWallets;
            acc.uniqueWallets += curr.uniqueWallets;
            return acc;
          },
          { uniqueWallets: 0, totalWallets: 0 },
        )
      : { uniqueWallets: 0, totalWallets: 0 };
  }, [statsQuery.data]);

  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      percent,
      walletType,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          strokeWidth={2}
          stroke={"var(--chakra-colors-backgroundHighlight)"}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="var(--chakra-colors-heading)"
        >{`${walletType}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="var(--chakra-colors-paragraph)"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  if (isLoading) {
    return (
      <div className="grid w-full place-items-center">
        <Spinner className="size-14" />
      </div>
    );
  }

  return (
    <GatedFeature
      title="Wallet Analytics is an advanced feature."
      description="Dive into user analytics and gather user insights on connect, smart and in-app wallets."
      trackingLabel="analytics"
      imgSrc="/assets/dashboard/features/analytics.png"
      imgWidth={576}
      imgHeight={624}
    >
      <Flex flexDir="column" gap={8}>
        <Flex flexDir="column" gap={2}>
          <Heading size="title.lg" as="h1">
            Connect Analytics
          </Heading>
          <Text>Visualize how users are connecting to your apps.</Text>
        </Flex>
        {keysQuery.data && selectedKey && (
          <Flex
            w="full"
            alignItems={{ base: "flex-start", lg: "center" }}
            gap={1}
            flexDir={{ base: "column", lg: "row" }}
          >
            <Text minW={32}>Select a Client ID:</Text>

            <ApiKeysMenu
              apiKeys={keysQuery.data}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
            />
          </Flex>
        )}
        <Flex flexDir="column" gap={8}>
          {statsQuery.data && statsQuery.data.timeSeries.length > 0 ? (
            <>
              <Flex gap={4}>
                <WalletStatCard
                  label="Connections"
                  value={totalStatsData.totalWallets}
                />
                <WalletStatCard
                  label="Unique Wallets"
                  value={totalStatsData.uniqueWallets}
                />
              </Flex>
              <Flex flexDir="column" gap={4} as={Card} bg="backgroundHighlight">
                <Stack spacing={0} padding={{ base: 2, md: 6 }}>
                  <Heading as="h3" size="subtitle.sm">
                    Daily Connections
                  </Heading>
                  <Text>
                    Total and unique wallets addresses that connected to your
                    app each day.
                  </Text>
                </Stack>
                <ChartContainer className="w-full" ratio={21 / 9}>
                  <AutoBarChart
                    data={barChartData}
                    showXAxis
                    showYAxis
                    index={{
                      id: "time",
                    }}
                  />
                </ChartContainer>
              </Flex>
              <Flex flexDir="column" gap={4} as={Card} bg="backgroundHighlight">
                <Stack spacing={0} padding={{ base: 2, md: 6 }}>
                  <Heading as="h3" size="subtitle.sm">
                    Wallet Connectors
                  </Heading>
                  <Text>
                    The different types of wallets used to connect to your app
                    each day.
                  </Text>
                </Stack>
                <ChartContainer className="w-full" ratio={21 / 9}>
                  <AutoBarChart
                    data={walletBarChartData}
                    showXAxis
                    showYAxis
                    index={{
                      id: "time",
                    }}
                    stacked
                  />
                </ChartContainer>
              </Flex>
              <Flex flexDir="column" gap={4} as={Card} bg="backgroundHighlight">
                <Stack spacing={0} padding={{ base: 2, md: 6 }}>
                  <Heading as="h3" size="subtitle.sm">
                    Wallet Distribution
                  </Heading>
                  <Text>
                    Distribution of wallet types used to connect to your app.
                  </Text>
                </Stack>
                <ChartContainer
                  className="w-full"
                  ratio={isMobile ? 1.5 : 21 / 9}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        onMouseEnter={onPieEnter}
                        data={pieChartData}
                        outerRadius={"70%"}
                        dataKey="totalWallets"
                        valueKey="walletType"
                        nameKey="walletType"
                        strokeWidth={2}
                        stroke={"var(--chakra-colors-backgroundHighlight)"}
                      >
                        {pieChartData.map((_entry, index) => (
                          <Cell
                            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                            key={index}
                            fill={barColors[index % barColors.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        layout={isMobile ? "horizontal" : "radial"}
                        verticalAlign={isMobile ? "bottom" : "middle"}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </Flex>
            </>
          ) : selectedKey ? (
            <Stack>
              <Heading as="h3" size="subtitle.sm">
                No data found for this Client ID.
              </Heading>
              <Text>
                Make sure you are running the latest version of the SDK with
                wallet analytics enabled.
              </Text>
            </Stack>
          ) : (
            <Stack>
              <Heading as="h3" size="subtitle.sm">
                No API keys found
              </Heading>
              <Text>
                Create a free API key and set it into your app to get started
                with wallet analytics.
              </Text>
              <LinkButton
                variant="solid"
                href={"/dashboard/settings/api-keys"}
                maxW={"sm"}
              >
                Create API Key
              </LinkButton>
            </Stack>
          )}
        </Flex>
      </Flex>
    </GatedFeature>
  );
};

const WalletStatCard: React.FC<{ label: string; value?: number }> = ({
  label,
  value,
}) => {
  return (
    <Card as={Stat}>
      <StatLabel mb={{ base: 1, md: 0 }}>{label}</StatLabel>
      <StatNumber>{value}</StatNumber>
    </Card>
  );
};

DashboardConnectAnalytics.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <ConnectSidebar activePage="analytics" />
    {page}
  </AppLayout>
);

DashboardConnectAnalytics.pageId = PageId.DashboardConnectAnalytics;

export default DashboardConnectAnalytics;
