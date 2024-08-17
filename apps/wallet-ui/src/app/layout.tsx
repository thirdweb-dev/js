import { Inter } from "next/font/google";

import Providers from "@/components/Providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`max-w-screen flex justify-center w-full min-h-screen ${inter.className}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
