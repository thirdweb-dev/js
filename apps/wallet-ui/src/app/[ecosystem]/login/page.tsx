"use client";
import { generatePayload, getCurrentUser, login, logout } from "@/lib/auth";
import { client } from "@/lib/client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import type { VerifyLoginPayloadParams } from "thirdweb/auth";
import { ConnectEmbed } from "thirdweb/react";
import { ecosystemWallet } from "thirdweb/wallets";

export default function Page({ params }: { params: { ecosystem: string } }) {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <ConnectEmbed
      theme={theme === "light" ? "light" : "dark"}
      autoConnect={true}
      wallets={[ecosystemWallet(`ecosystem.${params.ecosystem}`)]}
      client={client}
      auth={{
        getLoginPayload: generatePayload,
        doLogin: async (loginParams: VerifyLoginPayloadParams) => {
          const success = await login(loginParams);
          if (success) {
            router.push(`/wallet/${loginParams.payload.address}`);
          }
        },
        isLoggedIn: async () => !!(await getCurrentUser()),
        doLogout: logout,
      }}
    />
  );
}
