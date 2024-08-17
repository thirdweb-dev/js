import { metadataBase } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import Script from "next/script";
import { Footer } from "./features/Footer";
import { Header } from "./features/Header";
import "./globals.css";
import { Providers } from "./providers";

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
          "h-screen bg-background font-sans antialiased overflow-x-hidden",
          sansFont.variable,
          monoFont.variable,
        )}
      >
        <Providers>
          <div className="relative flex flex-col min-h-screen">
            <Header />
            {children}
            <div
              className="fixed bottom-0 left-0 right-0 h-[66%] z-[-1] bg-cover md:bg-[length:100%_100%] bg-no-repeat"
              style={{
                backgroundImage: "url(../../bottom-gradient.png)",
              }}
            />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
