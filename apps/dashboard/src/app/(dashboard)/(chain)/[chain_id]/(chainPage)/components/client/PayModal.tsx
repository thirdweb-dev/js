"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { thirdwebClient } from "@/constants/client";
import { defineDashboardChain } from "lib/defineDashboardChain";
import { useTheme } from "next-themes";
import { PayEmbed } from "thirdweb/react";
import { getSDKTheme } from "../../../../../../components/sdk-component-theme";

export function PayModalButton(props: { chainId: number; label: string }) {
  const { theme } = useTheme();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" className="w-full">
          {props.label}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="md:max-w-[360px] p-0 border-none bg-transparent"
        dialogOverlayClassName="backdrop-blur-lg"
        dialogCloseClassName="focus:ring-0"
      >
        <PayEmbed
          client={thirdwebClient}
          theme={getSDKTheme(theme === "dark" ? "dark" : "light")}
          className="!w-auto"
          payOptions={{
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
