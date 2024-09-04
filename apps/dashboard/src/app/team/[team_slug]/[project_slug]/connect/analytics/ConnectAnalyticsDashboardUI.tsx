import type { WalletStats } from "@3rdweb-sdk/react/hooks/useApi";
import { CableIcon, WalletCardsIcon } from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import { DailyConnectionsChartCard } from "./_components/DailyConnectionsChartCard";
import { WalletConnectorsChartCard } from "./_components/WalletConnectorsChartCard";
import { WalletDistributionChartCard } from "./_components/WalletDistributionChartCard";

export function ConnectAnalyticsDashboardUI(props: {
  walletStats: WalletStats;
  isLoading: boolean;
}) {
  const { totalWallets, uniqueWallets } = useMemo(() => {
    return props.walletStats.timeSeries.reduce(
      (acc, curr) => {
        acc.totalWallets += curr.totalWallets;
        acc.uniqueWallets += curr.uniqueWallets;
        return acc;
      },
      { uniqueWallets: 0, totalWallets: 0 },
    );
  }, [props.walletStats]);

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:gap-6">
        <Stat label="Connections" value={totalWallets} icon={CableIcon} />
        <Stat
          label="Unique Wallets"
          value={uniqueWallets}
          icon={WalletCardsIcon}
        />
      </div>

      <DailyConnectionsChartCard
        walletStats={props.walletStats}
        isLoading={props.isLoading}
      />

      <WalletConnectorsChartCard
        walletStats={props.walletStats}
        isLoading={props.isLoading}
      />

      <WalletDistributionChartCard
        walletStats={props.walletStats}
        isLoading={props.isLoading}
      />
    </div>
  );
}

const Stat: React.FC<{
  label: string;
  value?: number;
  icon: React.FC<{ className?: string }>;
}> = ({ label, value, icon: Icon }) => {
  return (
    <dl className="bg-muted/50 rounded-lg border border-border p-4 lg:p-6 flex items-center gap-4 justify-between">
      <div>
        <dd className="text-3xl lg:text-5xl font-semibold tracking-tight">
          {value}
        </dd>
        <dt className="text-sm lg:text-lg font-medium text-muted-foreground tracking-tight">
          {label}
        </dt>
      </div>
      <Icon className="text-muted-foreground size-12 opacity-50 hidden lg:block" />
    </dl>
  );
};
