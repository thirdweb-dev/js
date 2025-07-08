import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import { metadataBase } from "@/lib/constants";
import { cn } from "@/lib/utils";
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
  description: "thirdweb playground",
  metadataBase,
  title: "thirdweb playground",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarLinks = getSidebarLinks();
  return (
    <html lang="en" suppressHydrationWarning>
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
            <div className="relative grow">
              <Providers>{children}</Providers>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
