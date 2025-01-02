import { Stat } from "components/analytics/stat";
import { ActivityIcon, UserIcon } from "lucide-react";
import type { InAppWalletStats } from "types/analytics";

export function InAppWalletsSummary(props: {
  allTimeStats: InAppWalletStats[] | undefined;
  monthlyStats: InAppWalletStats[] | undefined;
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
      <Stat
        label="Total Users"
        value={allTimeStats?.uniqueWalletsConnected || 0}
        icon={ActivityIcon}
      />
      <Stat
        label="Monthly Active Users"
        value={monthlyStats?.uniqueWalletsConnected || 0}
        icon={UserIcon}
      />
    </div>
  );
}
