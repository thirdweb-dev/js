"use client";

import { ThirdwebProvider } from "thirdweb/react";

export function Providers(props: { children: React.ReactNode }) {
  return <ThirdwebProvider>{props.children}</ThirdwebProvider>;
}
