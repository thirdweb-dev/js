import type { Metadata } from "next";
import { metadataBase } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AppSidebarLayout } from "./AppSidebar";
import { Providers } from "./providers";
import "@workspace/ui/global.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

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
          GeistSans.variable,
          GeistMono.variable,
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
