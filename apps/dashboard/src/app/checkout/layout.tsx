import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Providers } from "./components/client/Providers.client";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function CheckoutLayout({
  children,
}: { children: React.ReactNode }) {
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
            {children}
          </body>
        </ThemeProvider>
      </Providers>
    </html>
  );
}
