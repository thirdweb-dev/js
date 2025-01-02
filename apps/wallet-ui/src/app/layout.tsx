import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex min-h-screen w-full max-w-screen justify-center",
          inter.className,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
