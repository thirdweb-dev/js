import type { Metadata } from "next";
import "../global.css";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { DashboardRouterTopProgressBar } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { NebulaProviders } from "./providers";

const title =
  "thirdweb Nebula: The Most powerful AI for interacting with the blockchain";
const description =
  "The most powerful AI for interacting with the blockchain, with real-time access to EVM chains and their data";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

const fontSans = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="/assets/nebula/favicon.ico" rel="icon" />
      </head>
      <body
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <NebulaProviders>{props.children}</NebulaProviders>
        <DashboardRouterTopProgressBar />
        <NextTopLoader
          color="hsl(var(--foreground))"
          height={3}
          shadow={false}
          showSpinner={false}
        />
      </body>
    </html>
  );
}
