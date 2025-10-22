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
          "min-h-dvh w-screen bg-background font-sans antialiased flex flex-col",
          fontSans.variable,
        )}
      >
        <PayProviders>{children}</PayProviders>
      </body>
    </html>
  );
}
