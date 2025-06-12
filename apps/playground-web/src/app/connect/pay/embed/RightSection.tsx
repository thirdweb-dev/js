"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { type Address, getContract, toWei } from "thirdweb";
import { arbitrum, base } from "thirdweb/chains";
import { claimTo } from "thirdweb/extensions/erc1155";
import {
  BuyWidget,
  CheckoutWidget,
  TransactionWidget,
  darkTheme,
  lightTheme,
  useActiveAccount,
} from "thirdweb/react";
import { Button } from "../../../../components/ui/button";
import { THIRDWEB_CLIENT } from "../../../../lib/client";
import { cn } from "../../../../lib/utils";
import { CodeGen } from "../components/CodeGen";
import type { BridgeComponentsPlaygroundOptions } from "../components/types";

const nftContract = getContract({
  address: "0xf0d0CBf84005Dd4eC81364D1f5D7d896Bd53D1B8",
  chain: base,
  client: THIRDWEB_CLIENT,
});

type Tab = "ui" | "code";

export function RightSection(props: {
  options: BridgeComponentsPlaygroundOptions;
  tab?: string;
}) {
  const pathname = usePathname();
  const [previewTab, _setPreviewTab] = useState<Tab>(() => {
    return "ui";
  });

  function setPreviewTab(tab: "ui" | "code") {
    _setPreviewTab(tab);
    window.history.replaceState({}, "", `${pathname}?tab=${tab}`);
  }

  const account = useActiveAccount();

  const themeObj =
    props.options.theme.type === "dark"
      ? darkTheme({
        colors: props.options.theme.darkColorOverrides,
      })
      : lightTheme({
        colors: props.options.theme.lightColorOverrides,
      });

  let embed: React.ReactNode;
  if (props.options.payOptions.widget === "buy") {
    embed = (
      <BuyWidget
        client={THIRDWEB_CLIENT}
        theme={themeObj}
        title={props.options.payOptions.title}
        tokenAddress={props.options.payOptions.buyTokenAddress}
        chain={props.options.payOptions.buyTokenChain}
        amount={toWei(props.options.payOptions.buyTokenAmount)}
      />
    );
  }

  if (props.options.payOptions.widget === "checkout") {
    embed = (
      <CheckoutWidget
        client={THIRDWEB_CLIENT}
        theme={themeObj}
        name={props.options.payOptions.title}
        tokenAddress={props.options.payOptions.buyTokenAddress}
        chain={props.options.payOptions.buyTokenChain}
        amount={toWei(props.options.payOptions.buyTokenAmount)}
        seller={props.options.payOptions.sellerAddress}
        presetOptions={[1, 2, 3]}
        purchaseData={{
          name: "Black Hoodie",
          description: "Size L | Ships worldwide.",
          image:
            "https://placehold.co/600x400/1d1d23/7c7a85?text=Your%20Product%20Here&font=roboto",
        }}
      />
    );
  }

  if (props.options.payOptions.widget === "transaction") {
    embed = (
      <TransactionWidget
        client={THIRDWEB_CLIENT}
        theme={themeObj}
        transaction={claimTo({
          contract: nftContract,
          quantity: 1n,
          tokenId: 2n,
          to: account?.address || "",
        })}
        title={props.options.payOptions.title}
        description={props.options.payOptions.description}
        image={props.options.payOptions.image}
      />
    );
  }

  return (
    <div className="flex shrink-0 flex-col gap-4 xl:sticky xl:top-0 xl:max-h-[100vh] xl:w-[764px]">
      <TabButtons
        tabs={[
          {
            name: "UI",
            isActive: previewTab === "ui",
            onClick: () => setPreviewTab("ui"),
          },
          {
            name: "Code",
            isActive: previewTab === "code",
            onClick: () => setPreviewTab("code"),
          },
        ]}
      />

      <div
        className={cn(
          "relative flex min-h-[300px] grow justify-center rounded-lg",
          previewTab !== "code" && "items-center",
        )}
      >
        <BackgroundPattern />

        {previewTab === "ui" && embed}

        {previewTab === "code" && <CodeGen options={props.options} />}
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
            key={tab.name}
            onClick={tab.onClick}
            variant="ghost"
            className={cn(
              "gap-2 px-4 text-base",
              tab.isActive
                ? "bg-accent text-foreground"
                : "bg-transparent text-muted-foreground",
            )}
          >
            {tab.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
