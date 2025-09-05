import { format } from "date-fns";
import { type ThirdwebClient, toTokens } from "thirdweb";
import type { BridgePayment } from "@/api/universal-bridge/developer";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import {
  TableCell,
  TableRow as TableRowComponent,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatTokenAmount } from "./format";

export function TableRow(props: {
  purchase: BridgePayment;
  client: ThirdwebClient;
}) {
  const { purchase } = props;
  const originAmount = toTokens(
    BigInt(purchase.originAmount),
    purchase.originToken.decimals,
  );
  const destinationAmount = toTokens(
    BigInt(purchase.destinationAmount),
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
    <TableRowComponent
      className="fade-in-0 border-border border-b duration-300"
      key={purchase.id}
    >
      {/* Paid */}
      <TableCell>{`${formatTokenAmount(originAmount)} ${purchase.originToken.symbol}`}</TableCell>

      {/* Bought */}
      <TableCell>
        {`${formatTokenAmount(destinationAmount)} ${purchase.destinationToken.symbol}`}
      </TableCell>

      {/* Type */}
      <TableCell>
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
      </TableCell>

      {/* Status */}
      <TableCell>
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
      </TableCell>

      {/* Address */}
      <TableCell>
        <WalletAddress address={purchase.sender} client={props.client} />
      </TableCell>

      {/* Date */}
      <TableCell>
        <p className="min-w-[180px] lg:min-w-auto">
          {format(new Date(purchase.createdAt), "LLL dd, y h:mm a")}
        </p>
      </TableCell>
    </TableRowComponent>
  );
}
