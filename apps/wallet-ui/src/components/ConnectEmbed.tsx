"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import type { VerifyLoginPayloadParams } from "thirdweb/auth";
import { ConnectEmbed as ThirdwebConnectEmbed } from "thirdweb/react";
import { ecosystemWallet } from "thirdweb/wallets";
import { useRouter } from "@/hooks/useRouter";
import { generatePayload, getCurrentUser, login, logout } from "@/lib/auth";
import { client } from "@/lib/client";
import { getEcosystemChains } from "@/lib/ecosystemConfig";

export function ConnectEmbed() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const ecosystemParam = params.ecosystem;
  const ecosystemSlug = Array.isArray(ecosystemParam)
    ? ecosystemParam[0]
    : ecosystemParam;

  const chains = useMemo(
    () => getEcosystemChains(ecosystemSlug),
    [ecosystemSlug],
  );

  const ecosystemId = ecosystemSlug
    ? (`ecosystem.${ecosystemSlug}` as `ecosystem.${string}`)
    : undefined;

  const { data: userAddress } = useQuery({
    queryFn: getCurrentUser,
    queryKey: ["userAddress"],
  });

  if (userAddress) {
    router.push(
      `/wallet/${userAddress}?${searchParams.toString()}`,
      params.ecosystem as string,
    );
  }

  return (
    <ThirdwebConnectEmbed
      chain={chains?.[0]}
      chains={chains}
      auth={{
        doLogin: async (loginParams: VerifyLoginPayloadParams) => {
          const success = await login(loginParams);
          if (success) {
            router.push(
              `/wallet/${loginParams.payload.address}?${searchParams.toString()}`,
              params.ecosystem as string,
            );
          }
        },
        doLogout: logout,
        getLoginPayload: generatePayload,
        isLoggedIn: async () => !!(await getCurrentUser()),
      }}
      autoConnect={true}
      client={client}
      theme={theme === "light" ? "light" : "dark"}
      wallets={ecosystemId ? [ecosystemWallet(ecosystemId)] : undefined}
    />
  );
}
