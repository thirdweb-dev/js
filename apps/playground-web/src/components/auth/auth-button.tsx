"use client";

import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/app/connect/auth/actions/auth";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { ConnectButton } from "thirdweb/react";
import { createClient } from "./usage-with-supabase/utils/client";

export function AuthButton() {
  const supabase = createClient();
  return (
    <ConnectButton
      client={THIRDWEB_CLIENT}
      auth={{
        isLoggedIn: async () => {
          const authResult = await isLoggedIn();
          if (!authResult) return false;
          return true;
        },
        doLogin: async (params) => {
          console.log("logging in!");
          await login(params);
        },
        getLoginPayload: async ({ address }) => generatePayload({ address }),
        doLogout: async () => {
          await supabase.auth.signOut();
          await logout();
        },
      }}
    />
  );
}
