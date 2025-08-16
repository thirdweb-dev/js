import "@workspace/ui/global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { DashboardRouterTopProgressBar } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { AppRouterProviders } from "./providers";

const fontSans = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  alternates: {
    canonical: "./",
  },
  description:
    "Build web3 apps easily with thirdweb's powerful SDKs, audited smart contracts, and developer tools—for Ethereum & 700+ EVM chains. Try now.",
  metadataBase: new URL("https://thirdweb.com"),
  openGraph: {
    description:
      "Build web3 apps easily with thirdweb's powerful SDKs, audited smart contracts, and developer tools—for Ethereum & 700+ EVM chains. Try now.",
    images: [
      {
        alt: "thirdweb",
        height: 630,
        url: "https://thirdweb.com/assets/og-image/thirdweb.png",
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: "thirdweb",
    title: "thirdweb: The complete web3 development platform",
    type: "website",
    url: "https://thirdweb.com",
  },
  title: "thirdweb: The complete web3 development platform",
  twitter: {
    card: "summary_large_image",
    creator: "@thirdweb",
    site: "@thirdweb",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <AppRouterProviders autoConnect={true}>{children}</AppRouterProviders>
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
