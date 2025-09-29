"use client";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { ConnectButton as ThirdwebConnectButton } from "thirdweb/react";
import { ecosystemWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";
import { getEcosystemChains } from "@/lib/ecosystemConfig";

export default function ConnectButton({
  ecosystem,
}: {
  ecosystem: `ecosystem.${string}`;
}) {
  const { theme } = useTheme();
  const chains = useMemo(() => getEcosystemChains(ecosystem), [ecosystem]);

  return (
    <ThirdwebConnectButton
      chain={chains?.[0]}
      chains={chains}
      client={client}
      theme={theme === "light" ? "light" : "dark"}
      wallets={[ecosystemWallet(ecosystem)]}
    />
  );
}
