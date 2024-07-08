import { updateSession } from "@/components/auth/usage-with-supabase/utils/middleware";
import type { NextRequest } from "next/server";

// We only need this middleware for the Supabase demo in Auth

export default async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: "/connect/auth",
};
