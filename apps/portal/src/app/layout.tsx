import "@workspace/ui/global.css";
import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { createMetadata } from "@/components/Document";
import { StickyTopContainer } from "../components/Document/StickyTopContainer";
import { EnableSmoothScroll } from "../components/others/SmoothScroll";
import { cn } from "../lib/utils";
import { Header } from "./Header";

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
        className={cn(GeistMono.variable, GeistSans.variable, "font-sans")}
        suppressHydrationWarning
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
          <EnableSmoothScroll />

          <div className="relative flex min-h-screen flex-col">
            <StickyTopContainer>
              <Header />
            </StickyTopContainer>

            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
