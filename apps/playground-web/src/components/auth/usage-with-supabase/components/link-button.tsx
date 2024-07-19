"use client";

import { useRouter } from "next/navigation";

export function LinkWalletButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-black mx-auto"
      onClick={async () => {
        const req = await fetch("/api/auth/linkWallet");
        const res = await req.json();
        router.refresh();
      }}
    >
      Link wallet
    </button>
  );
}
