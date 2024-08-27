"use client";

// don't know why - but getting compilation error without adding "use client" even though it's already added
// where we import AutoConnect from in thirdweb/react

import { thirdwebClient } from "@/constants/client";
import { AutoConnect } from "thirdweb/react";

export function TWAutoConnect() {
  return <AutoConnect client={thirdwebClient} />;
}
