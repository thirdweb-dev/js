"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useActiveAccount, useConnectModal } from "thirdweb/react";

export function LinkWalletButton() {
  const router = useRouter();
  const { connect } = useConnectModal();
  const account = useActiveAccount();
  const client = THIRDWEB_CLIENT;
  return (
    <button
      type="button"
      className="text-black mx-auto"
      onClick={async () => {
        if (!account) {
          await connect({ client });
        }
        const req = await fetch("/api/auth/linkWallet");
        const res = await req.json();
        router.refresh();
      }}
    >
      Link wallet
    </button>
  );
}
