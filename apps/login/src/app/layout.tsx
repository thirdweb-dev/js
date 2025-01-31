import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import { Providers } from "./providers";

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

export const metadata: Metadata = {
  title: "login with thirdweb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full bg-black text-white">
      <body
        className={`${sansFont.variable} ${monoFont.variable} h-full w-full font-sans antialiased`}
      >
        <Providers>
          <Suspense>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
