"use client";
import { ThemeProvider } from "next-themes";
import { useMemo } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/components/ui/sonner";
import { getConfiguredThirdwebClient } from "@/constants/thirdweb.server";
import { TWAutoConnect } from "../../../../(app)/components/autoconnect";

export function BridgeProviders({
  children,
  forcedTheme,
  clientId,
}: {
  children: React.ReactNode;
  forcedTheme?: string;
  clientId: string;
}) {
  const client = useMemo(
    () =>
      getConfiguredThirdwebClient({
        clientId,
        secretKey: undefined,
        teamId: undefined,
      }),
    [clientId],
  );
  return (
    <ThirdwebProvider>
      <TWAutoConnect client={client} />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        enableSystem={false}
        forcedTheme={forcedTheme}
      >
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </ThirdwebProvider>
  );
}

export function BridgeProvidersLite({
  children,
  forcedTheme,
}: {
  children: React.ReactNode;
  forcedTheme?: string;
}) {
  return (
    <ThirdwebProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        enableSystem={false}
        forcedTheme={forcedTheme}
      >
        {children}
      </ThemeProvider>
    </ThirdwebProvider>
  );
}
