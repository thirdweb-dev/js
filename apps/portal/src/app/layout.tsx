import "./globals.css";
import { createMetadata } from "@/components/Document";
import { ThemeProvider } from "next-themes";
import { Fira_Code, Inter } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { StickyTopContainer } from "../components/Document/StickyTopContainer";
import { Banner } from "../components/others/Banner";
import { EnableSmoothScroll } from "../components/others/SmoothScroll";
import { cn } from "../lib/utils";
import { Header } from "./Header";

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

export const metadata = createMetadata({
  title: "thirdweb docs",
  description: "thirdweb developer portal",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://thirdweb.com/js/pl.js"
          defer
          data-domain="portal.thirdweb.com"
          data-api="https://pl.thirdweb.com/api/event"
        />
      </head>

      <body
        className={cn(sansFont.variable, monoFont.variable, "font-sans")}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          enableSystem={false}
          defaultTheme="dark"
        >
          <NextTopLoader
            color="hsl(var(--link-foreground))"
            height={2}
            shadow={false}
            showSpinner={false}
          />
          <EnableSmoothScroll />

          <div className="relative flex min-h-screen flex-col">
            <StickyTopContainer>
              {/* Note: Please change id as well when changing text or href so that new banner is shown to user even if user dismissed the older one  */}
              <Banner
                id="ub-launch"
                text="Let users pay with whatever they have without leaving your app"
                href="https://thirdweb.com/connect/universal-bridge"
              />
              <Header />
            </StickyTopContainer>

            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
