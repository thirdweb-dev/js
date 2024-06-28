"use client";
import { ThemeProvider } from "next-themes";
import { ThirdwebProvider } from "thirdweb/react";
import { TransactionToastProvider } from "./TransactionToastProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <ThirdwebProvider>
        {children}
        <TransactionToastProvider />
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
