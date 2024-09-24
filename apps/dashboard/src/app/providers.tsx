"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ThirdwebProvider } from "thirdweb/react";
import { SyncChainStores } from "../stores/chainStores";

const queryClient = new QueryClient();

export function AppRouterProviders(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SyncChainStores />
      <ThirdwebProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {props.children}
        </ThemeProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
