"use client";
import { ThirdwebProvider as _ThirdwebProvider } from "thirdweb/react";

// This is a wrapper for the ThirdwebProvider to be used individually on each page
export default function ThirdwebProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <_ThirdwebProvider>{children}</_ThirdwebProvider>;
}
