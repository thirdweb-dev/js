import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import { metadataBase } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AppSidebarLayout } from "./AppSidebar";
import { Providers } from "./providers";
import "@workspace/ui/global.css";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background font-sans antialiased ",
          sansFont.variable,
          monoFont.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem={false}
        >
          <NextTopLoader
            color="hsl(var(--foreground))"
            height={2}
            shadow={false}
            showSpinner={false}
          />
          <div className="flex flex-col lg:h-dvh lg:flex-row">
            <AppSidebarLayout>
              <Providers>{children}</Providers>
            </AppSidebarLayout>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
