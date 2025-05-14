import "../../global.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Providers } from "./components/client/Providers.client";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default async function PayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "h-screen w-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            disableTransitionOnChange
            enableSystem={false}
            defaultTheme="dark"
          >
            <div className="relative mx-auto flex h-full w-full flex-col items-center justify-center overflow-x-hidden overflow-y-scroll py-10">
              <main className="container z-10 flex justify-center">
                {children}
              </main>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                src="/assets/login/background.svg"
                className="-bottom-12 -right-12 pointer-events-none absolute lg:right-0 lg:bottom-0"
              />
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
