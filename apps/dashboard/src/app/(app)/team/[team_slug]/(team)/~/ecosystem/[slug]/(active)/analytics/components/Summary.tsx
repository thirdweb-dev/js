import { StatCard } from "components/analytics/stat";
import { ActivityIcon, UserIcon } from "lucide-react";
import type { EcosystemWalletStats } from "types/analytics";

export function EcosystemWalletsSummary(props: {
  allTimeStats: EcosystemWalletStats[] | undefined;
  monthlyStats: EcosystemWalletStats[] | undefined;
}) {
  const allTimeStats = props.allTimeStats?.reduce(
    (acc, curr) => {
      acc.uniqueWalletsConnected += curr.uniqueWalletsConnected;
      return acc;
    },
    {
      uniqueWalletsConnected: 0,
    },
  );

  const monthlyStats = props.monthlyStats?.reduce(
    (acc, curr) => {
      acc.uniqueWalletsConnected += curr.uniqueWalletsConnected;
      return acc;
    },
    {
      uniqueWalletsConnected: 0,
    },
  );

  return (
    <div className="grid grid-cols-2 gap-4 lg:gap-6">
      <StatCard
        label="Total Users"
        value={allTimeStats?.uniqueWalletsConnected || 0}
        icon={ActivityIcon}
        isPending={false}
      />
      <StatCard
        label="Monthly Active Users"
        value={monthlyStats?.uniqueWalletsConnected || 0}
        icon={UserIcon}
        isPending={false}
      />
    </div>
  );
}
