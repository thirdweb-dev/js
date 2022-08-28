import { serialize } from "cookie";
import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
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
