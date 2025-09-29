"use client";

import { useMutation } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { CodeClient } from "@workspace/ui/components/code/code.client";
import { CodeIcon, LockIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
} from "thirdweb/react";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { cn } from "@/lib/utils";
import type { X402PlaygroundOptions } from "./types";

type Tab = "ui" | "client-code" | "server-code";

export function X402RightSection(props: { options: X402PlaygroundOptions }) {
  const pathname = usePathname();
  const [previewTab, _setPreviewTab] = useState<Tab>(() => {
    return "ui";
  });

  function setPreviewTab(tab: "ui" | "client-code" | "server-code") {
    _setPreviewTab(tab);
    window.history.replaceState({}, "", `${pathname}?tab=${tab}`);
  }

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
      searchParams.set("chainId", props.options.chain.id.toString());
      searchParams.set("payTo", props.options.payTo);
      searchParams.set("amount", props.options.amount);
      searchParams.set("tokenAddress", props.options.tokenAddress);
      searchParams.set("decimals", props.options.tokenDecimals.toString());
      searchParams.set("waitUntil", props.options.waitUntil);

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

  const clientCode = `import { createThirdwebClient } from "thirdweb";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { useActiveWallet } from "thirdweb/react";

const client = createThirdwebClient({ clientId: "your-client-id" });

export default function Page() {
  const wallet = useActiveWallet();

  const onClick = async () => {
    const fetchWithPay = wrapFetchWithPayment(fetch, client, wallet);
    const response = await fetchWithPay('/api/paid-endpoint');
  }

  return (
        <Button onClick={onClick}>Pay Now</Button>
  );
}`;

  const serverCode = `// Usage in a Next.js API route
import { settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

const thirdwebFacilitator = facilitator({
  client,
  serverWalletAddress: "0xYourServerWalletAddress",
  waitUtil: "${props.options.waitUntil}",
});

export async function POST(request: Request) {
  const paymentData = request.headers.get("x-payment");

  // verify and process the payment
  const result = await settlePayment({
    resourceUrl: "https://api.example.com/premium-content",
    method: "POST",
    paymentData,
    payTo: "${props.options.payTo}",
    network: defineChain(${props.options.chain.id}),
    price: {
      amount: "${Number(props.options.amount) * 10 ** props.options.tokenDecimals}",
      asset: {
        address: "${props.options.tokenAddress}",
      },
    },
    facilitator: thirdwebFacilitator,
  });

  if (result.status === 200) {
    // Payment verified and settled successfully
    return Response.json({ data: "premium content" });
  } else {
    // Payment required
    return Response.json(result.responseBody, {
      status: result.status,
      headers: result.responseHeaders,
    });
  }
}`;

  return (
    <div className="flex shrink-0 flex-col gap-4 xl:sticky xl:top-0 xl:w-[764px]">
      <TabButtons
        tabs={[
          {
            isActive: previewTab === "ui",
            name: "UI",
            onClick: () => setPreviewTab("ui"),
          },
          {
            isActive: previewTab === "client-code",
            name: "Client Code",
            onClick: () => setPreviewTab("client-code"),
          },
          {
            isActive: previewTab === "server-code",
            name: "Server Code",
            onClick: () => setPreviewTab("server-code"),
          },
        ]}
      />

      <div
        className={cn(
          "relative flex min-h-[200px] grow justify-center rounded-lg",
          previewTab === "ui" && "items-center",
        )}
      >
        <BackgroundPattern />

        {previewTab === "ui" && (
          <div className="flex flex-col gap-4 w-full p-4 md:p-12 max-w-lg mx-auto">
            <ConnectButton
              client={THIRDWEB_CLIENT}
              chain={props.options.chain}
              detailsButton={{
                displayBalanceToken:
                  props.options.tokenAddress !==
                  "0x0000000000000000000000000000000000000000"
                    ? {
                        [props.options.chain.id]: props.options.tokenAddress,
                      }
                    : undefined,
              }}
              supportedTokens={
                props.options.tokenAddress !==
                "0x0000000000000000000000000000000000000000"
                  ? {
                      [props.options.chain.id]: [
                        {
                          address: props.options.tokenAddress,
                          symbol: props.options.tokenSymbol,
                          name: props.options.tokenSymbol,
                        },
                      ],
                    }
                  : undefined
              }
            />
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <LockIcon className="w-5 h-5 text-muted-foreground" />
                <span className="text-lg font-medium">Paid API Call</span>
                <Badge variant="success">
                  <span className="text-xl font-bold">
                    {props.options.amount}{" "}
                    {props.options.tokenSymbol || "tokens"}
                  </span>
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
                Pay for access with {props.options.tokenSymbol || "tokens"} on{" "}
                {props.options.chain.name || `chain ${props.options.chain.id}`}
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CodeIcon className="w-5 h-5 text-muted-foreground" />
                <span className="text-lg font-medium">API Call Response</span>
              </div>
              {paidApiCall.isPending && (
                <div className="text-center">Loading...</div>
              )}
              {paidApiCall.isError && (
                <div className="text-center">
                  Error: {paidApiCall.error.message}
                </div>
              )}
              {paidApiCall.data && (
                <CodeClient
                  code={JSON.stringify(paidApiCall.data, null, 2)}
                  lang="json"
                />
              )}
            </Card>
          </div>
        )}

        {previewTab === "client-code" && (
          <div className="w-full">
            <CodeClient
              className="h-full rounded-none border-none"
              code={clientCode}
              lang="tsx"
            />
          </div>
        )}

        {previewTab === "server-code" && (
          <div className="w-full">
            <CodeClient
              className="h-full rounded-none border-none"
              code={serverCode}
              lang="typescript"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function BackgroundPattern() {
  const color = "hsl(var(--foreground)/15%)";
  return (
    <div
      className="absolute inset-0 z-[-1]"
      style={{
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        maskImage:
          "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 60%)",
      }}
    />
  );
}

function TabButtons(props: {
  tabs: Array<{
    name: string;
    isActive: boolean;
    onClick: () => void;
  }>;
}) {
  return (
    <div>
      <div className="flex justify-start gap-1 rounded-lg border bg-card p-2 shadow-md md:inline-flex">
        {props.tabs.map((tab) => (
          <Button
            className={cn(
              "gap-2 px-4 text-base",
              tab.isActive
                ? "bg-accent text-foreground"
                : "bg-transparent text-muted-foreground",
            )}
            key={tab.name}
            onClick={tab.onClick}
            variant="ghost"
          >
            {tab.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
