"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ThirdwebProvider } from "thirdweb/react";
import { TransactionToastProvider } from "./TransactionToastProvider";

const queryClient = new QueryClient();
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          <TransactionToastProvider />
          {children}
        </ThirdwebProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
