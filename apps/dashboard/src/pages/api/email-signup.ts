import { NextRequest, NextResponse } from "next/server";
import invariant from "tiny-invariant";

export const config = {
  runtime: "edge",
};

interface EmailSignupPayload {
  email: string;
  send_welcome_email?: boolean;
}

const handler = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "invalid method" }, { status: 400 });
  }

  const requestBody = (await req.json()) as EmailSignupPayload;

  const { email, send_welcome_email = false } = requestBody;
  invariant(process.env.BEEHIIV_API_KEY, "missing BEEHIIV_API_KEY");

  const response = await fetch(
    "https://api.beehiiv.com/v2/publications/pub_9f54090a-6d14-406b-adfd-dbb30574f664/subscriptions",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        email,
        send_welcome_email,
        utm_source: "thirdweb.com",
      }),
    },
  );

  return NextResponse.json(
    { status: response.statusText },
    {
      status: response.status,
    },
  );
};

export default handler;
