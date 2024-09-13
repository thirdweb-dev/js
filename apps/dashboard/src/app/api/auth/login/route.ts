import { type NextRequest, NextResponse } from "next/server";
import type { VerifyLoginPayloadParams } from "thirdweb/auth";
import { doLogin } from "../../../login/auth-actions";

export type isLoggedInResponseType = {
  isLoggedIn: boolean;
};

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as VerifyLoginPayloadParams;
  try {
    await doLogin(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to login" },
      {
        status: 400,
      },
    );
  }
};
