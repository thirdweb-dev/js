import { thirdwebAuth } from "@/components/auth/thirdweb-auth";
import { createClient } from "@/components/auth/usage-with-supabase/utils/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  /**
   * Make sure user is properly logged in for both Supabase and thirdweb Auth
   */
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("unauthorized - supabase");
  }

  const jwt = cookies().get("jwt");
  if (!jwt?.value) {
    throw new Error("null jwt value");
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
  if (!authResult.valid) {
    throw new Error("invalid auth result");
  }

  const address = authResult.parsedJWT.sub;
  if (!address) {
    throw new Error("could not get wallet address");
  }

  await supabase.auth.updateUser({
    data: {
      wallet_address: address,
    },
  });

  return NextResponse.json({ success: true });
}
