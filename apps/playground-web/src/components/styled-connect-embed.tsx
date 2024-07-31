"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import {
  ConnectEmbed,
  type ConnectEmbedProps,
  useActiveAccount,
} from "thirdweb/react";
import { WALLETS } from "../lib/constants";
import { StyledConnectButton } from "./styled-connect-button";

export function StyledConnectEmbed(
  props?: Omit<ConnectEmbedProps, "client" | "theme">,
) {
  const { theme } = useTheme();
  const account = useActiveAccount();

  return account ? (
    <div className="flex flex-col">
      <StyledConnectButton />
    </div>
  ) : (
    <ConnectEmbed
      wallets={WALLETS}
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
      {...props}
    />
  );
}
