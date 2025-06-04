import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import "../../global.css";
import { BridgeProviders } from "./components/client/Providers.client";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
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
          "h-screen w-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <BridgeProviders>{children}</BridgeProviders>
      </body>
    </html>
  );
}
