import { metadataBase } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import Script from "next/script";
import { AppSidebar } from "./AppSidebar";
import { Providers } from "./providers";
import "./globals.css";
import { MobileHeader } from "./MobileHeader";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
        <MobileHeader />
        <div className="relative">
          <div className="flex flex-col lg:flex-row">
            <AppSidebar />
            <div className="flex flex-col grow">
              <div className="grow relative container px-4 md:px-6">
                <Providers>{children}</Providers>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
