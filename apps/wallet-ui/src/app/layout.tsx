import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "@/components/Providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thirdweb Wallet UI",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`max-w-screen flex justify-center w-full min-h-screen ${inter.className}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
