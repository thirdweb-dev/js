"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ThirdwebProvider } from "thirdweb/react";
import { DashboardThirdwebProviderSetup } from "../../components/app-layouts/provider-setup";
import { AllChainsProvider } from "../../contexts/all-chains";
import { ChainsProvider } from "../../contexts/configured-chains";

const queryClient = new QueryClient();

export function AppRouterProviders(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AllChainsProvider>
        <ChainsProvider>
          <ThirdwebProvider>
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
