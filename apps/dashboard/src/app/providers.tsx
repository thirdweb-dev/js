"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardThirdwebProviderSetup } from "components/app-layouts/provider-setup";
import { AllChainsProvider } from "contexts/all-chains";
import { ChainsProvider } from "contexts/configured-chains";
import { ThemeProvider } from "next-themes";
import { ThirdwebProvider, webLocalStorage } from "thirdweb/react";
import { createConnectionManager } from "thirdweb/wallets";

const queryClient = new QueryClient();

const connectionManager = createConnectionManager(webLocalStorage, {
  initialIsAutoConnecting: true,
});

export function AppRouterProviders(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AllChainsProvider>
        <ChainsProvider>
          <ThirdwebProvider connectionManager={connectionManager}>
            <DashboardThirdwebProviderSetup>
              <ThemeProvider attribute="class" defaultTheme="dark">
                {props.children}
              </ThemeProvider>
            </DashboardThirdwebProviderSetup>
          </ThirdwebProvider>
        </ChainsProvider>
      </AllChainsProvider>
    </QueryClientProvider>
  );
}
