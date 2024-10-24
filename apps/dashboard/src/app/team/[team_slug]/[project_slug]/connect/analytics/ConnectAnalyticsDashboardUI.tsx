import { Button } from "@/components/ui/button";
import type { UserOpStats, WalletStats } from "@3rdweb-sdk/react/hooks/useApi";
import { Stat } from "components/analytics/stat";
import { AccountAbstractionSummary } from "components/smart-wallets/AccountAbstractionAnalytics/AccountAbstractionSummary";
import { CableIcon, WalletCardsIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { DailyConnectionsChartCard } from "./_components/DailyConnectionsChartCard";
import { WalletConnectorsChartCard } from "./_components/WalletConnectorsChartCard";
import { WalletDistributionChartCard } from "./_components/WalletDistributionChartCard";

export function ConnectAnalyticsDashboardUI(props: {
  walletUsage: WalletStats[];
  aggregateWalletUsage: WalletStats[];
  aggregateUserOpUsageQuery?: UserOpStats;
  connectLayoutSlug: string;
  isPending: boolean;
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
      {/* Connections */}
      <div className="grid grid-cols-2 gap-4 lg:gap-6">
        <Stat label="Connections" value={totalWallets} icon={CableIcon} />
        <Stat
          label="Unique Wallets"
          value={uniqueWallets}
          icon={WalletCardsIcon}
        />
      </div>

      <div className="h-4">
        <div className="w-full border-muted border-b" />
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-medium text-xl tracking-tight">
              Account Abstraction
            </h1>
            <p className="text-muted-foreground">
              Sponsor and batch transactions for your users.
            </p>
          </div>

          <div>
            <Button asChild variant="primary" size="sm" className="w-full">
              <Link href={`${props.connectLayoutSlug}/account-abstraction`}>
                View More Stats
              </Link>
            </Button>
          </div>
        </div>
        <AccountAbstractionSummary
          aggregateUserOpUsageQuery={props.aggregateUserOpUsageQuery}
        />
      </div>

      <div className="h-4">
        <div className="w-full border-muted border-b" />
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
