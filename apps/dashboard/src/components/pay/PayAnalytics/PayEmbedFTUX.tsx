"use client";
import { Button } from "@/components/ui/button";
import { CodeServer } from "@/components/ui/code/code.server";
import { TabButtons } from "@/components/ui/tabs";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { ExternalLinkIcon } from "lucide-react";
import { useState } from "react";

export function PayEmbedFTUX(props: { clientId: string }) {
  const [tab, setTab] = useState("embed");
  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b px-4 py-4 lg:px-6">
        <h2 className="font-semibold text-xl tracking-tight">
          Start Monetizing Your App
        </h2>
      </div>

      <div className="px-4 py-6 lg:p-6">
        <TabButtons
          tabClassName="!text-sm"
          tabs={[
            {
              name: "Embed",
              onClick: () => setTab("embed"),
              isActive: tab === "embed",
            },
            {
              name: "SDK",
              onClick: () => setTab("sdk"),
              isActive: tab === "sdk",
            },
            {
              name: "API",
              onClick: () => setTab("api"),
              isActive: tab === "api",
            },
          ]}
        />
        <div className="h-2" />
        {tab === "embed" && (
          <CodeServer
            code={embedCode(props.clientId)}
            lang="tsx"
            className="bg-background"
          />
        )}
        {tab === "sdk" && (
          <CodeServer
            code={sdkCode(props.clientId)}
            lang="ts"
            className="bg-background"
            ignoreFormattingErrors
          />
        )}
        {tab === "api" && (
          <CodeServer
            code={apiCode(props.clientId)}
            lang="bash"
            className="bg-background"
            ignoreFormattingErrors
          />
        )}
      </div>

      <div className="flex flex-col gap-3 border-t p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm">
            <TrackedLinkTW
              href="https://portal.thirdweb.com/pay"
              target="_blank"
              className="gap-2"
              category="pay-ftux"
              label="docs"
            >
              View Docs
              <ExternalLinkIcon className="size-4 text-muted-foreground" />
            </TrackedLinkTW>
          </Button>
        </div>
      </div>
    </div>
  );
}

const embedCode = (clientId: string) => `\
import { createThirdwebClient } from "thirdweb";
import { PayEmbed } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: "${clientId}",
});

export default function App() {
  return <PayEmbed client={client} />;
}`;

const sdkCode = (clientId: string) => `\
import { Bridge, NATIVE_TOKEN_ADDRESS, createThirdwebClient, toWei } from "thirdweb";

const client = createThirdwebClient({
  clientId: "${clientId}",
});

const quote = await Bridge.Buy.prepare({
  originChainId: 1,
  originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  destinationChainId: 10,
  destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  amount: toWei("0.01"),
  sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
  receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
  client,
});`;

const apiCode = (clientId: string) => `\
curl -X POST https://pay.thirdweb.com/v1/buy/prepare
  -H "Content-Type: application/json"
  -H "x-client-id: ${clientId}"
  -d '{"originChainId":"1","originTokenAddress":"0x...","destinationChainId":"10","destinationTokenAddress":"0x...","amount":"0.01"}'`;
