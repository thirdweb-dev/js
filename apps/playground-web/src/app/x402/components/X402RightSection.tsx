"use client";

import { Badge } from "@workspace/ui/components/badge";
import { CodeClient } from "@workspace/ui/components/code/code.client";
import { CircleDollarSignIcon, CodeIcon, LockIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ConnectButton, useFetchWithPayment } from "thirdweb/react";
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
  const [selectedAmount, setSelectedAmount] = useState<string>(
    props.options.amount,
  );

  // Sync selectedAmount when options change
  useEffect(() => {
    setSelectedAmount(props.options.amount);
  }, [props.options.amount]);

  function setPreviewTab(tab: "ui" | "client-code" | "server-code") {
    _setPreviewTab(tab);
    window.history.replaceState({}, "", `${pathname}?tab=${tab}`);
  }

  const { fetchWithPayment, isPending, data, error, isError } =
    useFetchWithPayment(THIRDWEB_CLIENT);

  const isTokenSelected =
    props.options.tokenAddress !==
      "0x0000000000000000000000000000000000000000" &&
    props.options.tokenSymbol !== "";

  const handlePayClick = async () => {
    const searchParams = new URLSearchParams();
    searchParams.set("chainId", props.options.chain.id.toString());
    searchParams.set("payTo", props.options.payTo);
    searchParams.set("amount", props.options.amount);
    searchParams.set("tokenAddress", props.options.tokenAddress);
    searchParams.set("decimals", props.options.tokenDecimals.toString());
    searchParams.set("waitUntil", props.options.waitUntil);
    searchParams.set("scheme", props.options.scheme);
    if (props.options.scheme === "upto") {
      searchParams.set("minPrice", props.options.minAmount);
      searchParams.set("settlementAmount", selectedAmount);
    }

    const url =
      "/api/paywall" +
      (searchParams.size > 0 ? `?${searchParams.toString()}` : "");

    await fetchWithPayment(url);
  };

  const clientCode = `import { createThirdwebClient } from "thirdweb";
import { useFetchWithPayment } from "thirdweb/react";

const client = createThirdwebClient({ clientId: "your-client-id" });

export default function Page() {
  const { fetchWithPayment, isPending } = useFetchWithPayment(client);

  const onClick = async () => {
    const data = await fetchWithPayment('/api/paid-endpoint');
    console.log(data);
  }

  return (
    <Button onClick={onClick} disabled={isPending}>
      {isPending ? "Processing..." : "Pay Now"}
    </Button>
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

        {previewTab === "ui" && !isTokenSelected && (
          <Card className="p-8 text-center max-w-md mx-auto my-auto">
            <CircleDollarSignIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select Payment Token</h3>
            <p className="text-sm text-muted-foreground">
              Please select a chain and payment token from the configuration
              panel to continue.
            </p>
          </Card>
        )}

        {previewTab === "ui" && isTokenSelected && (
          <div className="flex flex-col gap-4 w-full p-4 md:p-12 max-w-lg mx-auto">
            <ConnectButton
              client={THIRDWEB_CLIENT}
              chain={props.options.chain}
              detailsButton={{
                displayBalanceToken: {
                  [props.options.chain.id]: props.options.tokenAddress,
                },
              }}
              supportedTokens={{
                [props.options.chain.id]: [
                  {
                    address: props.options.tokenAddress,
                    symbol: props.options.tokenSymbol,
                    name: props.options.tokenSymbol,
                  },
                ],
              }}
            />
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <LockIcon className="w-5 h-5 text-muted-foreground" />
                <span className="text-lg font-medium">Paid API Call</span>
                <Badge variant="success">
                  <span className="text-xl font-bold">
                    {props.options.scheme === "upto"
                      ? `up to ${props.options.amount} ${props.options.tokenSymbol}`
                      : `${props.options.amount} ${props.options.tokenSymbol}`}
                  </span>
                </Badge>
              </div>

              {props.options.scheme === "upto" && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>
                      Min: {props.options.minAmount} {props.options.tokenSymbol}
                    </span>
                    <span>
                      Max: {props.options.amount} {props.options.tokenSymbol}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={Number(props.options.minAmount)}
                    max={Number(props.options.amount)}
                    step={Number(props.options.minAmount)}
                    value={selectedAmount}
                    onChange={(e) => setSelectedAmount(e.target.value)}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="text-center mt-2">
                    <span className="text-lg font-semibold">
                      {selectedAmount} {props.options.tokenSymbol}
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={handlePayClick}
                className="w-full mb-4"
                size="lg"
                disabled={isPending}
              >
                Access Premium Content
              </Button>
              <p className="text-sm text-muted-foreground">
                Pay for access with {props.options.tokenSymbol} on{" "}
                {props.options.chain.name || `chain ${props.options.chain.id}`}
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CodeIcon className="w-5 h-5 text-muted-foreground" />
                <span className="text-lg font-medium">API Call Response</span>
              </div>
              {isPending && <div className="text-center">Loading...</div>}
              {isError && (
                <div className="text-center">Error: {error?.message}</div>
              )}
              {!!data && (
                <CodeClient code={JSON.stringify(data, null, 2)} lang="json" />
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
