import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(400).json({
      error: "Invalid method. Only GET supported.",
    });
  }

  // Set the access token to 'none' and expire in 5 seconds
  res.setHeader(
    "Set-Cookie",
    serialize("thirdweb_auth_token", "", {
      path: "/",
      expires: new Date(Date.now() + 5 * 1000),
    })
  );

  return res.status(301).redirect(req.headers.referer as string);
}
