import { format } from "date-fns";
import { type ThirdwebClient, toTokens } from "thirdweb";
import type { Payment } from "@/api/universal-bridge/developer";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TableData } from "./common";
import { formatTokenAmount } from "./format";

export function TableRow(props: { purchase: Payment; client: ThirdwebClient }) {
  const { purchase } = props;
  const originAmount = toTokens(
    purchase.originAmount,
    purchase.originToken.decimals,
  );
  const destinationAmount = toTokens(
    purchase.destinationAmount,
    purchase.destinationToken.decimals,
  );
  const type = (() => {
    if (purchase.originToken.chainId !== purchase.destinationToken.chainId) {
      return "Bridge";
    }
    if (purchase.originToken.address !== purchase.destinationToken.address) {
      return "Swap";
    }
    return "Transfer";
  })();

  return (
    <tr
      className="fade-in-0 border-border border-b duration-300"
      key={purchase.id}
    >
      {/* Paid */}
      <TableData>{`${formatTokenAmount(originAmount)} ${purchase.originToken.symbol}`}</TableData>

      {/* Bought */}
      <TableData>
        {`${formatTokenAmount(destinationAmount)} ${purchase.destinationToken.symbol}`}
      </TableData>

      {/* Type */}
      <TableData>
        <Badge
          className={cn(
            "capitalize",
            type === "Transfer"
              ? "bg-fuchsia-200 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-200"
              : "bg-indigo-200 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
          )}
          variant="secondary"
        >
          {type.toLowerCase()}
        </Badge>
      </TableData>

      {/* Status */}
      <TableData>
        <Badge
          className="capitalize"
          variant={
            purchase.status === "COMPLETED"
              ? "success"
              : purchase.status === "PENDING"
                ? "warning"
                : "destructive"
          }
        >
          {purchase.status.toLowerCase()}
        </Badge>
      </TableData>

      {/* Address */}
      <TableData>
        <WalletAddress address={purchase.sender} client={props.client} />
      </TableData>

      {/* Date */}
      <TableData>
        <p className="min-w-[180px] lg:min-w-auto">
          {format(new Date(purchase.createdAt), "LLL dd, y h:mm a")}
        </p>
      </TableData>
    </tr>
  );
}
