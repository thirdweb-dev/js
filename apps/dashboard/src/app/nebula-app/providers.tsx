"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isSanctionedAddress } from "data/eth-sanctioned-addresses";
import { ThemeProvider, useTheme } from "next-themes";
import { useMemo } from "react";
import { Toaster } from "sonner";
import { ThirdwebProvider, useActiveAccount } from "thirdweb/react";
import { MiniAppProvider } from "./(app)/_farcaster/miniapp-provider";
import MinikitProvider from "./(app)/_worldcoin/minikit-provider";
import { NebulaConnectWallet } from "./(app)/components/NebulaConnectButton";

const queryClient = new QueryClient();

export function NebulaProviders(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <MiniAppProvider>
          <MinikitProvider>
            <ThemeProvider
              attribute="class"
              disableTransitionOnChange
              enableSystem={false}
              defaultTheme="light"
            >
              <ToasterSetup />
              <SanctionedAddressesChecker>
                {props.children}
              </SanctionedAddressesChecker>
            </ThemeProvider>
          </MinikitProvider>
        </MiniAppProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}

function ToasterSetup() {
  const { theme } = useTheme();
  return <Toaster richColors theme={theme === "light" ? "light" : "dark"} />;
}

const SanctionedAddressesChecker = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const address = useActiveAccount()?.address;
  const isBlocked = useMemo(() => {
    return address && isSanctionedAddress(address);
  }, [address]);

  if (isBlocked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <p> Your wallet address is blocked </p>
          <NebulaConnectWallet />
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
