"use client";

// don't know why - but getting compilation error without adding "use client" even though it's already added
// where we import AutoConnect from in thirdweb/react

import { useThirdwebClient } from "@/constants/thirdweb.client";
import { AutoConnect } from "thirdweb/react";

export function TWAutoConnect() {
  const client = useThirdwebClient();
  return <AutoConnect client={client} />;
}
