import { Stat } from "components/analytics/stat";
import { ActivityIcon, CoinsIcon } from "lucide-react";
import type { UserOpStats } from "types/analytics";

export function AccountAbstractionSummary(props: {
  aggregateUserOpUsageQuery?: UserOpStats;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:gap-6">
      <Stat
        label="Mainnet Sponsored Transactions"
        value={props.aggregateUserOpUsageQuery?.successful || 0}
        icon={ActivityIcon}
      />
      <Stat
        label="Mainnet Gas Sponsored"
        value={props.aggregateUserOpUsageQuery?.sponsoredUsd || 0}
        formatter={(value: number) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value)
        }
        icon={CoinsIcon}
      />
    </div>
  );
}
