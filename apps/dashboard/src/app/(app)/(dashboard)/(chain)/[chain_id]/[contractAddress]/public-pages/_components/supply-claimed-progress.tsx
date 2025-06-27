import { InfinityIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supplyFormatter } from "../nft/format";

export function SupplyClaimedProgress(props: {
  claimedSupply: bigint;
  totalSupply: bigint | "unlimited";
}) {
  // if total supply is unlimited
  if (props.totalSupply === "unlimited") {
    return (
      <p className="flex items-center justify-between gap-2">
        <span className="font-medium text-sm">Claimed Supply </span>
        <span className="flex items-center gap-1 font-bold text-sm">
          {supplyFormatter.format(props.claimedSupply)} /{" "}
          <InfinityIcon aria-label="Unlimited" className="size-4" />
        </span>
      </p>
    );
  }

  // if total supply is 0 - don't show anything
  if (props.totalSupply === 0n) {
    return null;
  }

  // multiply by 10k to have precision up to 2 decimal places in percentage value
  const soldFractionTimes10KBigInt =
    (props.claimedSupply * 10000n) / props.totalSupply;

  const soldPercentage = Number(soldFractionTimes10KBigInt) / 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">Supply Claimed</span>
        <span className="font-bold text-sm">
          {supplyFormatter.format(props.claimedSupply)} /{" "}
          {supplyFormatter.format(props.totalSupply)}
        </span>
      </div>
      <Progress className="h-2.5" value={soldPercentage} />
      <p className="font-medium text-muted-foreground text-xs">
        {soldPercentage === 0 && props.claimedSupply !== 0n && "~"}
        {soldPercentage.toFixed(2)}% Sold
      </p>
    </div>
  );
}
