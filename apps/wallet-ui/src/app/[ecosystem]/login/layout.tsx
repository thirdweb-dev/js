"use client";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const account = useActiveAccount();

  if (account) {
    router.push(`/wallet/${account.address}`); // This will route to /[ecosystem]/wallet/[address] based on the subdomain routing
  }

  return (
    <main className="flex flex-col items-center justify-center w-full">
      {children}
    </main>
  );
}
