export const dynamic = 'force-dynamic';
import { createClient } from "@/components/auth/usage-with-supabase/utils/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Make sure user is properly logged in with Supabase
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("unauthorized - supabase");
  }

  const body = await request.json();
  await supabase.auth.updateUser({
    data: {
      wallet_address: body.linkAddress,
    },
  });

  return NextResponse.json({ success: true });
}
