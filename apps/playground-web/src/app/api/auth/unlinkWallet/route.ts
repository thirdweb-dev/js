import { createClient } from "@/components/auth/usage-with-supabase/utils/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("unauthorized");
  }
  await supabase.auth.updateUser({
    data: {
      wallet_address: "",
    },
  });
  return NextResponse.json({ success: true });
}
