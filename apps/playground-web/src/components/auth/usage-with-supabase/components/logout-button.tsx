"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../utils/client";
import { logout } from "@/app/connect/auth/actions/auth";

export function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-red-500 mx-auto mt-5"
      onClick={async () => {
        await supabase.auth.signOut();
        await logout();
        router.refresh();
      }}
    >
      Log out
    </button>
  );
}
