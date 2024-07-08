import { updateSession } from "@/components/auth/usage-with-supabase/utils/middleware";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  return await updateSession(request);
}
