import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toTokens } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";

interface BalanceOverviewProps {
  chain: ChainMetadata;
  balance: bigint;
  isLoading: boolean;
}

export function BalanceOverview({
  chain,
  balance,
  isLoading,
}: BalanceOverviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">
          {isLoading ? <Spinner className="size-3" /> : toTokens(balance, 18)}{" "}
          {chain.nativeCurrency.symbol}
        </p>
      </CardContent>
    </Card>
  );
}
