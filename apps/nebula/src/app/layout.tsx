import type { Metadata } from "next";
import "../global.css";
import { DashboardRouterTopProgressBar } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { NebulaProviders } from "./providers";

const title =
  "thirdweb Nebula: The Most powerful AI for interacting with the blockchain";
const description =
  "The most powerful AI for interacting with the blockchain, with real-time access to EVM chains and their data";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/nebula/favicon.ico" />
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
