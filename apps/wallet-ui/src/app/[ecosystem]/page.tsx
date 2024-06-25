"use client";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
import { ConnectButton, useActiveAccount } from "thirdweb/react";

export default function Page() {
  const account = useActiveAccount();
  const router = useRouter();

  if (!account) {
    router.push("/login"); // This will route to /[ecosystem]/login based on the subdomain routing
  } else {
    router.push(`/${account.address}/`);
  }

  return null;
}
