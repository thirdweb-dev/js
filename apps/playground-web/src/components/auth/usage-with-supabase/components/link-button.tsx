"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useActiveAccount, useConnectModal } from "thirdweb/react";

export function LinkWalletButton() {
  const router = useRouter();
  const account = useActiveAccount();
  const { connect } = useConnectModal();
  return (
    <button
      type="button"
      className="text-black mx-auto"
      onClick={async () => {
        if (!account) {
          await connect({ client: THIRDWEB_CLIENT });
        }
        const req = await fetch("/api/auth/linkWallet", {
          method: "POST",
          body: JSON.stringify({ linkAddress: account?.address ?? "" }),
        });
        const res = await req.json();
        router.refresh();
      }}
    >
      Link wallet
    </button>
  );
}
