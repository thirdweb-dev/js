import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "@workspace/ui/global.css";
import { NEXT_PUBLIC_BRIDGE_PAGE_CLIENT_ID } from "@/constants/public-envs";
import { BridgeProviders } from "./components/client/Providers.client";

const fontSans = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function BridgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!NEXT_PUBLIC_BRIDGE_PAGE_CLIENT_ID) {
    throw new Error("NEXT_PUBLIC_BRIDGE_PAGE_CLIENT_ID is not set");
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh bg-background font-sans antialiased flex flex-col",
          fontSans.variable,
        )}
      >
        <BridgeProviders clientId={NEXT_PUBLIC_BRIDGE_PAGE_CLIENT_ID}>
          {children}
        </BridgeProviders>
      </body>
    </html>
  );
}
