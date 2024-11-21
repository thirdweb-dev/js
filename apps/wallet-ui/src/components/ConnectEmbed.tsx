"use client";
import { useRouter } from "@/hooks/useRouter";
import { generatePayload, getCurrentUser, login, logout } from "@/lib/auth";
import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useParams, useSearchParams } from "next/navigation";
import type { VerifyLoginPayloadParams } from "thirdweb/auth";
import { ConnectEmbed as ThirdwebConnectEmbed } from "thirdweb/react";
import { ecosystemWallet } from "thirdweb/wallets";

export function ConnectEmbed() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const { data: userAddress } = useQuery({
    queryKey: ["userAddress"],
    queryFn: getCurrentUser,
  });

  if (userAddress) {
    router.push(
      `/wallet/${userAddress}?${searchParams.toString()}`,
      params.ecosystem as string,
    );
  }

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
              `/wallet/${loginParams.payload.address}?${searchParams.toString()}`,
              params.ecosystem as string,
            );
          }
        },
        isLoggedIn: async () => !!(await getCurrentUser()),
        doLogout: logout,
      }}
    />
  );
}
