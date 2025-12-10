import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const fontSans = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function BridgeEmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh bg-background font-sans antialiased flex flex-col",
          fontSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
