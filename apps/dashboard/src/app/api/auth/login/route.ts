import type { NextRequest } from "next/server";
import type { VerifyLoginPayloadParams } from "thirdweb/auth";
import { doLogin } from "../../../login/auth-actions";

export const POST = async (request: NextRequest) => {
  const payload = (await request.json()) as VerifyLoginPayloadParams;
  await doLogin(payload);
  return new Response(null, { status: 200 });
};
