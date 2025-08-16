import "@workspace/ui/global.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { PayProviders } from "./components/client/Providers.client";

const fontSans = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
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
        <PayProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
            enableSystem={false}
          >
            <div className="relative mx-auto flex h-full w-full flex-col items-center justify-center overflow-x-hidden overflow-y-scroll py-10">
              <main className="container z-10 flex justify-center">
                {children}
              </main>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="-bottom-12 -right-12 pointer-events-none absolute lg:right-0 lg:bottom-0"
                src="/assets/login/background.svg"
              />
            </div>
          </ThemeProvider>
        </PayProviders>
      </body>
    </html>
  );
}
