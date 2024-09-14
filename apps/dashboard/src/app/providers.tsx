"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardThirdwebProviderSetup } from "components/app-layouts/provider-setup";
import { AllChainsProvider } from "contexts/all-chains";
import { ChainsProvider } from "contexts/configured-chains";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { setOverrides } from "../lib/vercel-utils";

const queryClient = new QueryClient();

export function AppRouterProviders(props: { children: React.ReactNode }) {
  // run this ONCE on app load
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setOverrides();
  }, []);
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
