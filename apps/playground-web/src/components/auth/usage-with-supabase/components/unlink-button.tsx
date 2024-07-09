"use client";

import { useRouter } from "next/navigation";

export function UnlinkButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="underline w-fit px-3 text-center mx-auto"
      onClick={async () => {
        const req = await fetch("/api/auth/unlinkWallet");
        const res = await req.json();
        router.refresh();
      }}
    >
      Unlink
    </button>
  );
}
