"use client";

import { useMutation } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { CodeClient } from "@workspace/ui/components/code/code.client";
import { CodeIcon, LockIcon } from "lucide-react";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
} from "thirdweb/react";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { THIRDWEB_CLIENT } from "../../../../lib/client";
import { chain, token } from "./constants";

export function X402ClientPreview() {
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const paidApiCall = useMutation({
    mutationFn: async () => {
      if (!activeWallet) {
        throw new Error("No active wallet");
      }
      const fetchWithPay = wrapFetchWithPayment(
        fetch,
        THIRDWEB_CLIENT,
        activeWallet,
        BigInt(1 * 10 ** 18),
      );
      const searchParams = new URLSearchParams();
      searchParams.set("chainId", chain.id.toString());
      searchParams.set("payTo", activeWallet.getAccount()?.address || "");
      // TODO (402): dynamic from playground config
      // if (token) {
      //   searchParams.set("amount", "0.01");
      //   searchParams.set("tokenAddress", token.address);
      //   searchParams.set("decimals", token.decimals.toString());
      // }
      const url =
        "/api/paywall" +
        (searchParams.size > 0 ? "?" + searchParams.toString() : "");
      const response = await fetchWithPay(url.toString());
      return response.json();
    },
  });

  const handlePayClick = async () => {
    paidApiCall.mutate();
  };

  return (
    <div className="flex flex-col gap-4 w-full p-4 md:p-12 max-w-lg mx-auto">
      <ConnectButton
        client={THIRDWEB_CLIENT}
        chain={chain}
        detailsButton={{
          displayBalanceToken: {
            [chain.id]: token.address,
          },
        }}
        supportedTokens={{
          [chain.id]: [token],
        }}
      />
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <LockIcon className="w-5 h-5 text-muted-foreground" />
          <span className="text-lg font-medium">Paid API Call</span>
          <Badge variant="success">
            <span className="text-xl font-bold">0.1 {token.symbol}</span>
          </Badge>
        </div>

        <Button
          onClick={handlePayClick}
          className="w-full mb-4"
          size="lg"
          disabled={paidApiCall.isPending || !activeAccount}
        >
          Access Premium Content
        </Button>
        <p className="text-sm text-muted-foreground">
          Pay for access with {token.symbol} on{" "}
          {chain.name || `chain ${chain.id}`}
        </p>
        {chain.testnet && token.symbol.toLowerCase() === "usdc" && (
          <p className="text-sm text-muted-foreground">
            {" "}
            <a
              className="underline"
              href={"https://faucet.circle.com/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here to get testnet {token.symbol} on {chain.name}
            </a>
          </p>
        )}
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <CodeIcon className="w-5 h-5 text-muted-foreground" />
          <span className="text-lg font-medium">API Call Response</span>
        </div>
        {paidApiCall.isPending && <div className="text-center">Loading...</div>}
        {paidApiCall.isError && (
          <div className="text-center">Error: {paidApiCall.error.message}</div>
        )}
        {paidApiCall.data && (
          <CodeClient
            code={JSON.stringify(paidApiCall.data, null, 2)}
            lang="json"
          />
        )}
      </Card>
    </div>
  );
}
