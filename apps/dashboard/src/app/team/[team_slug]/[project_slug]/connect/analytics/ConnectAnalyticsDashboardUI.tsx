import type { WalletStats } from "@3rdweb-sdk/react/hooks/useApi";
import { CableIcon, WalletCardsIcon } from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import { DailyConnectionsChartCard } from "./_components/DailyConnectionsChartCard";
import { WalletConnectorsChartCard } from "./_components/WalletConnectorsChartCard";
import { WalletDistributionChartCard } from "./_components/WalletDistributionChartCard";

export function ConnectAnalyticsDashboardUI(props: {
  walletUsage: WalletStats[];
  aggregateWalletUsage: WalletStats[];
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

const Stat: React.FC<{
  label: string;
  value?: number;
  icon: React.FC<{ className?: string }>;
}> = ({ label, value, icon: Icon }) => {
  return (
    <dl className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/50 p-4 lg:p-6">
      <div>
        <dd className="font-semibold text-3xl tracking-tight lg:text-5xl">
          {value?.toLocaleString()}
        </dd>
        <dt className="font-medium text-muted-foreground text-sm tracking-tight lg:text-lg">
          {label}
        </dt>
      </div>
      <Icon className="hidden size-12 text-muted-foreground opacity-50 lg:block" />
    </dl>
  );
};
