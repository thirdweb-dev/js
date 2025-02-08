import { metadataBase } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import Script from "next/script";
import { AppSidebar } from "./AppSidebar";
import { Providers } from "./providers";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { MobileHeader } from "./MobileHeader";
import { getSidebarLinks } from "./navLinks";

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "variable",
});

const monoFont = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "variable",
});

export const metadata: Metadata = {
  metadataBase,
  title: "thirdweb playground",
  description: "thirdweb playground",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarLinks = await getSidebarLinks();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://thirdweb.com/js/pl.js"
          defer
          data-domain="playground.thirdweb.com"
          data-api="https://pl.thirdweb.com/api/event"
        />
      </head>

      <body
        className={cn(
          "bg-background font-sans antialiased ",
          sansFont.variable,
          monoFont.variable,
        )}
      >
        <NextTopLoader
          color="hsl(var(--foreground))"
          height={2}
          shadow={false}
          showSpinner={false}
        />
        <MobileHeader links={sidebarLinks} />
        <div className="flex flex-col lg:h-dvh lg:flex-row">
          <AppSidebar links={sidebarLinks} />
          <div className="flex grow flex-col lg:overflow-auto">
            <div className="container relative grow px-4 md:px-6">
              <Providers>{children}</Providers>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
