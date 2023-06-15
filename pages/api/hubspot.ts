import { NextRequest, NextResponse } from "next/server";
import invariant from "tiny-invariant";

export const config = {
  runtime: "edge",
};

interface ContactFormPayload {
  fields: any;
}

const handler = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "invalid method" }, { status: 400 });
  }

  const requestBody = (await req.json()) as ContactFormPayload;

  const { fields } = requestBody;
  invariant(process.env.HUBSPOT_ACCESS_TOKEN, "missing HUBSPOT_ACCESS_TOKEN");

  const response = await fetch(
    "https://api.hsforms.com/submissions/v3/integration/secure/submit/23987964/38849262-3605-4eb2-883b-b4f1aa5ad845",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      method: "POST",
      body: JSON.stringify({ fields }),
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
