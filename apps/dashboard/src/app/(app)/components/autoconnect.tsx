"use client";
import type { ThirdwebClient } from "thirdweb";
import { AutoConnect } from "thirdweb/react";

export function TWAutoConnect(props: { client: ThirdwebClient }) {
  return <AutoConnect client={props.client} />;
}
