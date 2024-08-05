"use client";
import { client } from "@/lib/client";
import { useTheme } from "next-themes";
import type { VerifyLoginPayloadParams } from "thirdweb/auth";
import { ConnectEmbed } from "thirdweb/react";
import { ecosystemWallet } from "thirdweb/wallets";
import { generatePayload, getCurrentUser, login, logout } from "../auth";

export default function Page({ params }: { params: { ecosystem: string } }) {
  const { theme } = useTheme();

  return (
    <ConnectEmbed
      theme={theme === "light" ? "light" : "dark"}
      autoConnect={true}
      wallets={[ecosystemWallet(`ecosystem.${params.ecosystem}`)]}
      client={client}
      auth={{
        getLoginPayload: generatePayload,
        doLogin: async (params: VerifyLoginPayloadParams) => {
          await login(params, `wallet/${params.payload.address}`);
        },
        isLoggedIn: getCurrentUser,
        doLogout: logout,
      }}
    />
  );
}
