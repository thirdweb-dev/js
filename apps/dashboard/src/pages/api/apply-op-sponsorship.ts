import { type NextRequest, NextResponse } from "next/server";
import invariant from "tiny-invariant";

export const config = {
  runtime: "edge",
};

interface ApplyOpSponsorshipPayload {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  fields: any;
}

const handler = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "invalid method" }, { status: 400 });
  }

  const requestBody = (await req.json()) as ApplyOpSponsorshipPayload;

  const { fields } = requestBody;
  invariant(process.env.HUBSPOT_ACCESS_TOKEN, "missing HUBSPOT_ACCESS_TOKEN");

  const response = await fetch(
    "https://api.hsforms.com/submissions/v3/integration/secure/submit/23987964/2fbf6a3b-d4cc-4a23-a4f5-42674e8487b9",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      method: "POST",
      body: JSON.stringify({ fields }),
    },
  );

  if (!response.ok) {
    const body = await response.json();
    console.error("error", body);
  }

  return NextResponse.json(
    { status: response.statusText },
    {
      status: response.status,
    },
  );
};

export default handler;
