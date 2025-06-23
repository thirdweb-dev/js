"use client";
import { useTheme } from "next-themes";
import type { ThirdwebClient } from "thirdweb";
import { PayEmbed } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { defineDashboardChain } from "@/lib/defineDashboardChain";
import { getSDKTheme } from "../../../../../../../../@/utils/sdk-component-theme";

export function PayModalButton(props: {
  chainId: number;
  label: string;
  client: ThirdwebClient;
}) {
  const { theme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="primary">
          {props.label}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="border-none bg-transparent p-0 md:max-w-[360px]"
        dialogCloseClassName="focus:ring-0"
        dialogOverlayClassName="backdrop-blur-lg"
      >
        <PayEmbed
          className="!w-auto"
          client={props.client}
          payOptions={{
            prefillBuy: {
              allowEdits: {
                amount: true,
                chain: false,
                token: true,
              },
              // Do not include local chain overrides for chain pages
              // eslint-disable-next-line no-restricted-syntax
              chain: defineDashboardChain(props.chainId, undefined),
            },
          }}
          theme={getSDKTheme(theme === "dark" ? "dark" : "light")}
        />
      </DialogContent>
    </Dialog>
  );
}
