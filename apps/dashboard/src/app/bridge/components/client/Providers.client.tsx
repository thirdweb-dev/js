"use client";
import { ThemeProvider } from "next-themes";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/components/ui/sonner";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { TWAutoConnect } from "../../../(app)/components/autoconnect";

const thirdwebClient = getClientThirdwebClient();

export function BridgeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <TWAutoConnect client={thirdwebClient} />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        enableSystem={false}
      >
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </ThirdwebProvider>
  );
}
