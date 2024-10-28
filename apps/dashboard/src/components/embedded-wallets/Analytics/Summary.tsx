import type { InAppWalletStats } from "@3rdweb-sdk/react/hooks/useApi";
import { Stat } from "components/analytics/stat";
import { ActivityIcon, UserIcon } from "lucide-react";

export function InAppWalletsSummary(props: {
  allTimeStats: InAppWalletStats[];
  monthlyStats: InAppWalletStats[];
}) {
  const allTimeStats = props.allTimeStats.reduce(
    (acc, curr) => {
      acc.uniqueWalletsConnected += curr.uniqueWalletsConnected;
      return acc;
    },
    {
      uniqueWalletsConnected: 0,
    },
  );

  const monthlyStats = props.monthlyStats.reduce(
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
        value={allTimeStats.uniqueWalletsConnected}
        icon={ActivityIcon}
      />
      <Stat
        label="Monthly Active Users"
        value={monthlyStats.uniqueWalletsConnected}
        icon={UserIcon}
      />
    </div>
  );
}
