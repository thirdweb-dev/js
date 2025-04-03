"use client";
import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import type { ChartConfig } from "@/components/ui/chart";
import { ReactIcon } from "components/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "components/icons/brand-icons/TypeScriptIcon";
import { UnityIcon } from "components/icons/brand-icons/UnityIcon";
import { UnrealIcon } from "components/icons/brand-icons/UnrealIcon";
import { DocLink } from "components/shared/DocLink";
import { formatDate } from "date-fns";
import { useMemo } from "react";
import type { InAppWalletStats } from "types/analytics";

type ChartData = Record<string, number> & {
  time: string; // human readable date
};
const defaultLabel = "Unknown Auth";

export function InAppWalletUsersChartCardUI(props: {
  inAppWalletStats: InAppWalletStats[];
  isPending: boolean;
  title: string;
  description: string;
}) {
  const { inAppWalletStats } = props;
  const topChainsToShow = 10;

  const { chartConfig, chartData } = useMemo(() => {
    const _chartConfig: ChartConfig = {};
    const _chartDataMap: Map<string, ChartData> = new Map();
    const authMethodToVolumeMap: Map<string, number> = new Map();
    // for each stat, add it in _chartDataMap
    for (const stat of inAppWalletStats) {
      const chartData = _chartDataMap.get(stat.date);
      const { authenticationMethod } = stat;

      // if no data for current day - create new entry
      if (!chartData && stat.uniqueWalletsConnected > 0) {
        _chartDataMap.set(stat.date, {
          time: stat.date,
          [authenticationMethod || defaultLabel]: stat.uniqueWalletsConnected,
        } as ChartData);
      } else if (chartData) {
        chartData[authenticationMethod || defaultLabel] =
          (chartData[authenticationMethod || defaultLabel] || 0) +
          stat.uniqueWalletsConnected;
      }

      authMethodToVolumeMap.set(
        authenticationMethod || defaultLabel,
        stat.uniqueWalletsConnected +
          (authMethodToVolumeMap.get(authenticationMethod || defaultLabel) ||
            0),
      );
    }

    const authMethodsSorted = Array.from(authMethodToVolumeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map((w) => w[0]);

    const authMethodsToShow = authMethodsSorted.slice(0, topChainsToShow);
    const authMethodsAsOther = authMethodsSorted.slice(topChainsToShow);

    // replace chainIdsToTagAsOther chainId with "other"
    for (const data of _chartDataMap.values()) {
      for (const authMethod in data) {
        if (authMethodsAsOther.includes(authMethod)) {
          data.others = (data.others || 0) + (data[authMethod] || 0);
          delete data[authMethod];
        }
      }
    }

    authMethodsToShow.forEach((walletType, i) => {
      _chartConfig[walletType] = {
        label: authMethodsToShow[i],
        color: `hsl(var(--chart-${(i % 10) + 1}))`,
      };
    });

    if (authMethodsToShow.length > topChainsToShow) {
      // Add Other
      authMethodsToShow.push("others");
      _chartConfig.others = {
        label: "Others",
        color: "hsl(var(--muted-foreground))",
      };
    }

    return {
      chartData: Array.from(_chartDataMap.values()).sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      ),
      chartConfig: _chartConfig,
    };
  }, [inAppWalletStats]);

  const uniqueAuthMethods = Object.keys(chartConfig);
  const disableActions =
    props.isPending ||
    chartData.length === 0 ||
    chartData.every((data) => data.sponsoredUsd === 0);

  return (
    <ThirdwebBarChart
      customHeader={
        <div className="relative px-6 pt-6">
          <h3 className="mb-0.5 font-semibold text-xl tracking-tight">
            {props.title}
          </h3>
          <p className="mb-3 text-muted-foreground text-sm">
            {props.description}
          </p>

          <ExportToCSVButton
            className="top-6 right-6 mb-4 w-full bg-background md:absolute md:mb-0 md:flex md:w-auto"
            fileName="Connect Wallets"
            disabled={disableActions}
            getData={async () => {
              // Shows the number of each type of wallet connected on all dates
              const header = ["Date", ...uniqueAuthMethods];
              const rows = chartData.map((data) => {
                const { time, ...rest } = data;
                return [
                  time,
                  ...uniqueAuthMethods.map((w) => (rest[w] || 0).toString()),
                ];
              });
              return { header, rows };
            }}
          />
        </div>
      }
      data={chartData}
      isPending={props.isPending}
      config={chartConfig}
      chartClassName="aspect-[1.5] lg:aspect-[3.5]"
      emptyChartState={<InAppWalletUsersEmptyChartState />}
      variant="stacked"
      showLegend
      hideLabel={false}
      toolTipLabelFormatter={(_v, item) => {
        if (Array.isArray(item)) {
          const time = item[0].payload.time as number;
          return formatDate(new Date(time), "MMM d, yyyy");
        }
        return undefined;
      }}
    />
  );
}

function InAppWalletUsersEmptyChartState() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <span className="mb-6 text-center text-lg">
        Connect users to your app with social logins
      </span>
      <div className="flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <DocLink
          link="https://portal.thirdweb.com/typescript/v5/inAppWallet"
          label="TypeScript"
          icon={TypeScriptIcon}
        />
        <DocLink
          link="https://portal.thirdweb.com/react/v5/in-app-wallet/get-started"
          label="React"
          icon={ReactIcon}
        />
        <DocLink
          link="https://portal.thirdweb.com/react/v5/in-app-wallet/get-started"
          label="React Native"
          icon={ReactIcon}
        />
        <DocLink
          link="https://portal.thirdweb.com/unity/v5/wallets/in-app-wallet"
          label="Unity"
          icon={UnityIcon}
        />
        <DocLink
          link="https://portal.thirdweb.com/unreal-engine/getting-started"
          label="Unreal Engine"
          icon={UnrealIcon}
        />
      </div>
    </div>
  );
}
