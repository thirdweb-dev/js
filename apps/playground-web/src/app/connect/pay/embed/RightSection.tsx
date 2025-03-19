"use client";

import { abstractWallet } from "@abstract-foundation/agw-react/thirdweb";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ZERO_ADDRESS, getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { claimTo } from "thirdweb/extensions/erc1155";
import {
  PayEmbed,
  darkTheme,
  lightTheme,
  useActiveAccount,
} from "thirdweb/react";
import { type WalletId, createWallet } from "thirdweb/wallets";
import { Button } from "../../../../components/ui/button";
import { THIRDWEB_CLIENT } from "../../../../lib/client";
import { cn } from "../../../../lib/utils";
import { CodeGen } from "../components/CodeGen";
import type { PayEmbedPlaygroundOptions } from "../components/types";

const nftContract = getContract({
  address: "0xf0d0CBf84005Dd4eC81364D1f5D7d896Bd53D1B8",
  chain: base,
  client: THIRDWEB_CLIENT,
});

type Tab = "ui" | "code";

export function RightSection(props: {
  options: PayEmbedPlaygroundOptions;
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

  const embed = (
    <PayEmbed
      client={THIRDWEB_CLIENT}
      theme={themeObj}
      // locale={connectOptions.localeId}
      connectOptions={{
        accountAbstraction: props.options.connectOptions
          .enableAccountAbstraction
          ? {
              chain: props.options.payOptions.buyTokenChain || base,
              sponsorGas: true,
            }
          : undefined,
      }}
      payOptions={{
        metadata: {
          name:
            props.options.payOptions.title ||
            (props.options.payOptions.mode === "transaction"
              ? "Transaction"
              : props.options.payOptions.mode === "direct_payment"
                ? "Purchase"
                : "Fund Wallet"),
          image:
            props.options.payOptions.image ||
            `https://placehold.co/600x400/${
              props.options.theme.type === "dark"
                ? "1d1d23/7c7a85"
                : "f2eff3/6f6d78"
            }?text=Your%20Product%20Here&font=roboto`,
        },

        // Mode-specific options
        // biome-ignore lint/suspicious/noExplicitAny: union type
        mode: (props.options.payOptions.mode as any) || "fund_wallet",

        // Only include buyWithCrypto and buyWithFiat when they're false
        ...(props.options.payOptions.buyWithCrypto === false
          ? { buyWithCrypto: false }
          : {}),
        ...(props.options.payOptions.buyWithFiat === false
          ? { buyWithFiat: false }
          : {}),

        ...(props.options.payOptions.mode === "fund_wallet" ||
        !props.options.payOptions.mode
          ? {
              // Fund wallet mode options
              prefillBuy: {
                chain: props.options.payOptions.buyTokenChain || base,
                amount: props.options.payOptions.buyTokenAmount || "0.01",
                ...(props.options.payOptions.buyTokenInfo
                  ? {
                      token: props.options.payOptions.buyTokenInfo,
                    }
                  : {}),
              },
            }
          : {}),

        ...(props.options.payOptions.mode === "direct_payment"
          ? {
              // Direct payment mode options
              paymentInfo: {
                chain: props.options.payOptions.buyTokenChain || base,
                sellerAddress:
                  props.options.payOptions.sellerAddress ||
                  "0x0000000000000000000000000000000000000000",
                amount: props.options.payOptions.buyTokenAmount || "0.01",
                ...(props.options.payOptions.buyTokenInfo
                  ? {
                      token: props.options.payOptions.buyTokenInfo,
                    }
                  : {}),
              },
            }
          : {}),

        ...(props.options.payOptions.mode === "transaction"
          ? {
              // Transaction mode options (simplified for demo)
              transaction: claimTo({
                contract: nftContract,
                quantity: 1n,
                tokenId: 2n,
                to: account?.address || ZERO_ADDRESS,
              }),
            }
          : {}),
      }}
    />
  );

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

/**
 * @internal
 */
export function getWallets(walletIds: WalletId[]) {
  const wallets = [
    ...walletIds.map((id) => {
      if (id === "xyz.abs") {
        return abstractWallet();
      }
      return createWallet(id);
    }),
  ];

  return wallets;
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
      <div className="flex justify-start gap-1 rounded-lg border bg-muted p-2 shadow-md md:inline-flex">
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
