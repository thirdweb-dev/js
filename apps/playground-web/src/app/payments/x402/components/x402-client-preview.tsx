"use client";

import { useMutation } from "@tanstack/react-query";
import { CodeClient } from "@workspace/ui/components/code/code.client";
import { CodeIcon, LockIcon } from "lucide-react";
import { arbitrumSepolia } from "thirdweb/chains";
import {
  ConnectButton,
  getDefaultToken,
  useActiveAccount,
  useActiveWallet,
} from "thirdweb/react";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { THIRDWEB_CLIENT } from "../../../../lib/client";

const chain = arbitrumSepolia;
const token = getDefaultToken(chain, "USDC");

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
      );
      const response = await fetchWithPay("/api/paywall");
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
            [chain.id]: token!.address,
          },
        }}
        supportedTokens={{
          [chain.id]: [token!],
        }}
      />
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <LockIcon className="w-5 h-5 text-muted-foreground" />
          <span className="text-lg font-medium">Paid API Call</span>
          <span className="text-xl font-bold text-red-600">$0.01</span>
        </div>

        <Button
          onClick={handlePayClick}
          className="w-full mb-4"
          size="lg"
          disabled={paidApiCall.isPending || !activeAccount}
        >
          Pay Now
        </Button>
        <p className="text-sm text-muted-foreground">
          {" "}
          <a
            className="underline"
            href={"https://faucet.circle.com/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here to get USDC on {chain.name}
          </a>
        </p>
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
