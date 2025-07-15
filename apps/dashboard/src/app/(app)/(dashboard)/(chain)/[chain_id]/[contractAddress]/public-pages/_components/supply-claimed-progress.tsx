import { InfinityIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supplyFormatter } from "../nft/format";

export function SupplyClaimedProgress(props: {
  claimedSupplyTokens: number;
  totalSupplyTokens: number | "unlimited";
}) {
  // if total supply is unlimited
  if (props.totalSupplyTokens === "unlimited") {
    return (
      <p className="flex items-center justify-between gap-2">
        <span className="font-medium text-sm">Claimed Supply </span>
        <span className="flex items-center gap-1 font-bold text-sm">
          {supplyFormatter.format(props.claimedSupplyTokens)} /{" "}
          <InfinityIcon aria-label="Unlimited" className="size-4" />
        </span>
      </p>
    );
  }

  // if total supply is 0 - don't show anything
  if (props.totalSupplyTokens === 0) {
    return null;
  }

  // multiply by 10k to have precision up to 2 decimal places in percentage value

  const soldPercentage =
    (props.claimedSupplyTokens / props.totalSupplyTokens) * 100;

  const percentToShow = soldPercentage.toFixed(2);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">Supply Claimed</span>
        <span className="font-bold text-sm">
          {supplyFormatter.format(props.claimedSupplyTokens)} /{" "}
          {supplyFormatter.format(props.totalSupplyTokens)}
        </span>
      </div>
      <Progress className="h-2.5" value={soldPercentage} />
      <p className="font-medium text-muted-foreground text-xs">
        {percentToShow === "0.00" ? "~0.00%" : `${percentToShow}%`} Sold
      </p>
    </div>
  );
}
