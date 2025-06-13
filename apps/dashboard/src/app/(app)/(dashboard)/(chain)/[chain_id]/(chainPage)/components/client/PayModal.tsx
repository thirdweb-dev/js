"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { defineDashboardChain } from "lib/defineDashboardChain";
import { useTheme } from "next-themes";
import type { ThirdwebClient } from "thirdweb";
import { PayEmbed } from "thirdweb/react";
import { getSDKTheme } from "../../../../../../components/sdk-component-theme";

export function PayModalButton(props: {
  chainId: number;
  label: string;
  client: ThirdwebClient;
}) {
  const { theme } = useTheme();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" className="w-full">
          {props.label}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="border-none bg-transparent p-0 md:max-w-[360px]"
        dialogOverlayClassName="backdrop-blur-lg"
        dialogCloseClassName="focus:ring-0"
      >
        <PayEmbed
          client={props.client}
          theme={getSDKTheme(theme === "dark" ? "dark" : "light")}
          className="!w-auto"
          payOptions={{
            onPurchaseSuccess(info) {
              if (
                info.type === "crypto" &&
                info.status.status !== "NOT_FOUND"
              ) {
                // success no tracking
              }

              if (info.type === "fiat" && info.status.status !== "NOT_FOUND") {
                // success no tracking
              }
            },
            prefillBuy: {
              // Do not include local chain overrides for chain pages
              // eslint-disable-next-line no-restricted-syntax
              chain: defineDashboardChain(props.chainId, undefined),
              allowEdits: {
                chain: false,
                amount: true,
                token: true,
              },
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
