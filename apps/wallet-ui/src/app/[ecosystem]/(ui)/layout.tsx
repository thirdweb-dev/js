"use client";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
import { ConnectButton, useActiveAccount } from "thirdweb/react";

export default function Layout({
  children,
  params,
}: { children: React.ReactNode; params: { ecosystem: string } }) {
  return (
    <div className="">
      <header className="flex items-center justify-between w-full p-4 border-b bg-background border-accent">
        <div />
        <ConnectButton client={client} />
      </header>
      <main className="p-8">
        <h1 className="text-3xl font-semibold text-center">
          {params.ecosystem}
        </h1>
        {children}
      </main>
    </div>
  );
}
