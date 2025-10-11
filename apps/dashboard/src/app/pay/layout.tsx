import "@workspace/ui/global.css";
import { Inter } from "next/font/google";
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
          <div className="relative mx-auto flex h-full w-full items-center justify-center overflow-x-hidden overflow-y-scroll">
            {children}
          </div>
        </PayProviders>
      </body>
    </html>
  );
}
