"use client";

import { Toaster } from "@/components/ui/sonner";
import { isSanctionedAddress } from "@/data/eth-sanctioned-addresses";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useMemo } from "react";
import { ThirdwebProvider, useActiveAccount } from "thirdweb/react";
import { NebulaConnectWallet } from "./(app)/components/NebulaConnectButton";

const queryClient = new QueryClient();

export function NebulaProviders(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          enableSystem={false}
          defaultTheme="light"
        >
          <Toaster richColors />
          <SanctionedAddressesChecker>
            {props.children}
          </SanctionedAddressesChecker>
        </ThemeProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
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
