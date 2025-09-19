import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "@workspace/ui/global.css";
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh bg-background font-sans antialiased flex flex-col",
          fontSans.variable,
        )}
      >
        <BridgeProviders>{children}</BridgeProviders>
      </body>
    </html>
  );
}
