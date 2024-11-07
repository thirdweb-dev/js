"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ThirdwebProvider } from "thirdweb/react";
import { Onboarding } from "../components/onboarding";
import { OpCreditsGrantedModalWrapper } from "../components/onboarding/OpCreditsGrantedModalWrapper";
import { PosthogIdentifier } from "../components/wallets/PosthogIdentifier";
import { SyncChainStores } from "../stores/chainStores";
import { TWAutoConnect } from "./components/autoconnect";

const queryClient = new QueryClient();

export function AppRouterProviders(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SyncChainStores />
      <ThirdwebProvider>
        <TWAutoConnect />
        <OpCreditsGrantedModalWrapper />
        <PosthogIdentifier />
        <Onboarding />
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          enableSystem={false}
          defaultTheme="dark"
        >
          {props.children}
        </ThemeProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
