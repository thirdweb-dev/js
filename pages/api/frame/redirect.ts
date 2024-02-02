import { Warpcast, untrustedMetaDataSchema } from "classes/Warpcast";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  trustedData: {
    messageBytes: string;
  };
  untrustedData: {
    url: string;
  };
}

export const config = {
  runtime: "edge",
};
// 1. Verify that the trusted data from warpcast is valid
// 2. Once verified just return the url that they've shared in the frame
// 3. Finally give a response of redirect with status code 302. More info here: https://warpcast.notion.site/Farcaster-Frames-4bd47fe97dc74a42a48d3a234636d8c5
export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "invalid method" }, { status: 400 });
  }

  const body = (await req.json()) as RequestBody;

  const metadata = untrustedMetaDataSchema.parse(body.untrustedData);

  const trustedMessageByte = z.string().parse(body.trustedData?.messageBytes);

  // This will throw an exception if neynar's API doesn't validate the message
  await Warpcast.validateMessage(trustedMessageByte);

  return NextResponse.redirect(metadata.url, {
    status: 302,
  });
}
