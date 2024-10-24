import type { UserOpStats } from "@3rdweb-sdk/react/hooks/useApi";
import { Stat } from "components/analytics/stat";
import { ActivityIcon, CoinsIcon } from "lucide-react";

export function AccountAbstractionSummary(props: {
  aggregateUserOpUsageQuery?: UserOpStats;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:gap-6">
      <Stat
        label="Sponsored Transactions"
        value={props.aggregateUserOpUsageQuery?.successful || 0}
        icon={ActivityIcon}
      />
      <Stat
        label="Total Sponsored"
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
