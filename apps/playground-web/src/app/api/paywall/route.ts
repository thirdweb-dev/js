import { NextResponse } from "next/server";
// Allow streaming responses up to 5 minutes
export const maxDuration = 300;

export async function GET(_req: Request) {
  return NextResponse.json({
    success: true,
    message: "Congratulations! You have accessed the protected route.",
  });
}
