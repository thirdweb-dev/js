import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Providers } from "./components/client/Providers.client";
import { ThemeHandler } from "./components/client/ThemeHandler.client";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Providers>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          enableSystem={false}
          defaultTheme="dark"
        >
          <body
            className={cn(
              "bg-background font-sans antialiased",
              fontSans.variable,
            )}
          >
            <Suspense>
              <ThemeHandler />
            </Suspense>
            {children}
          </body>
        </ThemeProvider>
      </Providers>
    </html>
  );
}
