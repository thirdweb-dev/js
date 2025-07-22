import "./globals.css";
import { Fira_Code, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { createMetadata } from "@/components/Document";
import { StickyTopContainer } from "../components/Document/StickyTopContainer";
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
  description: "thirdweb developer portal",
  title: "thirdweb docs",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(sansFont.variable, monoFont.variable, "font-sans")}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem={false}
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
              {/* <Banner
                href="https://thirdweb.com/payments"
                text="Let users pay with whatever they have without leaving your app"
              /> */}
              <Header />
            </StickyTopContainer>

            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
