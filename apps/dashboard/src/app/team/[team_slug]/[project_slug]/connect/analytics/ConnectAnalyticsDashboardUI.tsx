import { Button } from "@/components/ui/button";
import type { Range } from "components/analytics/date-range-selector";
import { Stat } from "components/analytics/stat";
import { InAppWalletsSummary } from "components/embedded-wallets/Analytics/Summary";
import { AccountAbstractionSummary } from "components/smart-wallets/AccountAbstractionAnalytics/AccountAbstractionSummary";
import { differenceInDays } from "date-fns";
import { ArrowRightIcon, CableIcon, WalletCardsIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type {
  InAppWalletStats,
  UserOpStats,
  WalletStats,
} from "types/analytics";
import { DateRangeSelector } from "../../../../../../components/analytics/date-range-selector";
import { IntervalSelector } from "../../../../../../components/analytics/interval-selector";
import { DailyConnectionsChartCard } from "./_components/DailyConnectionsChartCard";
import { WalletConnectorsChartCard } from "./_components/WalletConnectorsChartCard";
import { WalletDistributionChartCard } from "./_components/WalletDistributionChartCard";

export function ConnectAnalyticsDashboardUI(props: {
  walletUsage: WalletStats[];
  aggregateWalletUsage: WalletStats[];
  aggregateUserOpUsageQuery?: UserOpStats;
  connectLayoutSlug: string;
  isPending: boolean;
  inAppAggregateQuery?: {
    allTimeStats: InAppWalletStats[];
    monthlyStats: InAppWalletStats[];
  };
  setRange: (range: Range) => void;
  range: Range;
  intervalType: "day" | "week";
  setIntervalType: (intervalType: "day" | "week") => void;
}) {
  const { totalWallets, uniqueWallets } = useMemo(() => {
    return props.aggregateWalletUsage.reduce(
      (acc, curr) => {
        acc.totalWallets += curr.totalConnections;
        acc.uniqueWallets += curr.uniqueWalletsConnected;
        return acc;
      },
      { uniqueWallets: 0, totalWallets: 0 },
    );
  }, [props.aggregateWalletUsage]);

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div>
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="mb-1 font-semibold text-xl tracking-tight md:text-2xl">
              Connections
            </h3>
            <p className="text-muted-foreground">
              View how many users are connecting to your app.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:gap-6">
          <Stat label="Connections" value={totalWallets} icon={CableIcon} />
          <Stat
            label="Unique Wallets"
            value={uniqueWallets}
            icon={WalletCardsIcon}
          />
        </div>
      </div>

      <div className="h-4">
        <div className="w-full border-separate border-b" />
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="mb-1 font-semibold text-xl tracking-tight md:text-2xl">
              In-App Wallets
            </h3>
            <p className="text-muted-foreground">
              View metrics for your in-app wallets.
            </p>
          </div>

          <div>
            <Button asChild variant="primary" size="sm" className="w-full">
              <Link href={`${props.connectLayoutSlug}/in-app-wallets`}>
                In-App Wallet Metrics
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <InAppWalletsSummary
          allTimeStats={props.inAppAggregateQuery?.allTimeStats}
          monthlyStats={props.inAppAggregateQuery?.monthlyStats}
        />
      </div>

      <div className="h-4">
        <div className="w-full border-separate border-b" />
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="mb-1 font-semibold text-xl tracking-tight md:text-2xl">
              Account Abstraction
            </h3>
            <p className="text-muted-foreground">
              View how smart wallets are used in your app.
            </p>
          </div>

          <div>
            <Button asChild variant="primary" size="sm" className="w-full">
              <Link href={`${props.connectLayoutSlug}/account-abstraction`}>
                Account Abstraction Metrics
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <AccountAbstractionSummary
          aggregateUserOpUsageQuery={props.aggregateUserOpUsageQuery}
        />
      </div>

      <div className="h-4">
        <div className="w-full border-separate border-b" />
      </div>

      <div className="flex justify-end gap-3">
        <DateRangeSelector
          range={props.range}
          setRange={(newRange) => {
            props.setRange(newRange);
            const days = differenceInDays(newRange.to, newRange.from);
            props.setIntervalType(days > 30 ? "week" : "day");
          }}
        />
        <IntervalSelector
          intervalType={props.intervalType}
          setIntervalType={props.setIntervalType}
        />
      </div>

      <DailyConnectionsChartCard
        walletStats={props.walletUsage}
        isPending={props.isPending}
      />

      <WalletConnectorsChartCard
        walletStats={props.walletUsage}
        isPending={props.isPending}
      />

      <WalletDistributionChartCard
        walletStats={props.walletUsage}
        isPending={props.isPending}
      />
    </div>
  );
}
