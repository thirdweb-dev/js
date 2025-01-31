"use client";

import { ThirdwebProvider } from "thirdweb/react";

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
};
