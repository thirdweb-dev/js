"use client";
import { generatePayload, getCurrentUser, login, logout } from "@/lib/auth";
import { client } from "@/lib/client";
import { useTheme } from "next-themes";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { VerifyLoginPayloadParams } from "thirdweb/auth";
import { ConnectEmbed as ThirdwebConnectEmbed } from "thirdweb/react";
import { ecosystemWallet } from "thirdweb/wallets";

export function ConnectEmbed() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  return (
    <ThirdwebConnectEmbed
      theme={theme === "light" ? "light" : "dark"}
      autoConnect={true}
      wallets={[ecosystemWallet(`ecosystem.${params.ecosystem}`)]}
      client={client}
      auth={{
        getLoginPayload: generatePayload,
        doLogin: async (loginParams: VerifyLoginPayloadParams) => {
          const success = await login(loginParams);
          if (success) {
            router.push(
              `/${params.ecosystem}/wallet/${loginParams.payload.address}?${searchParams.toString()}`,
            );
          }
        },
        isLoggedIn: async () => !!(await getCurrentUser()),
        doLogout: logout,
      }}
    />
  );
}
