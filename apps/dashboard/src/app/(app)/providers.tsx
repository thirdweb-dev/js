"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useEffect, useMemo } from "react";
import {
  ThirdwebProvider,
  useActiveAccount,
  useConnectionManager,
} from "thirdweb/react";
import { CustomConnectWallet } from "@/components/connect-wallet";
import { Toaster } from "@/components/ui/sonner";
import { isSanctionedAddress } from "@/constants/eth-sanctioned-addresses";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { SyncChainStores } from "@/stores/chainStores";
import { TWAutoConnect } from "./components/autoconnect";

const queryClient = new QueryClient();
const thirdwebClient = getClientThirdwebClient();

export function AppRouterProviders(props: {
  children: React.ReactNode;
  autoConnect: boolean;
}) {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <SyncChainStores />
        <ThirdwebProvider>
          <SyncChainDefinitionsToConnectionManager />
          {props.autoConnect && <TWAutoConnect client={thirdwebClient} />}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
            enableSystem={false}
          >
            <Toaster richColors />
            <SanctionedAddressesChecker>
              {props.children}
            </SanctionedAddressesChecker>
          </ThemeProvider>
        </ThirdwebProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}

function SyncChainDefinitionsToConnectionManager() {
  const { allChainsV5 } = useAllChainsData();
  const connectionManager = useConnectionManager();

  // whenever user updates chains, update connection manager store
  // This is the same pattern used in ConnectButton for updating the connection manager when props.chain or props.chains change
  // this is added to root layout because ConnectButton is not always rendered in the page
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (allChainsV5.length > 0) {
      connectionManager.defineChains(allChainsV5);
    }
  }, [allChainsV5, connectionManager]);

  return null;
}

const client = getClientThirdwebClient();

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
          <CustomConnectWallet
            client={client}
            isLoggedIn={true}
            loginRequired={false}
          />
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
